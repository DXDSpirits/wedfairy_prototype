var express = require('express'),http = require('http'),path = require('path'),qiniu = require('qiniu');
var app = express();
qiniu.conf.ACCESS_KEY='Dl9yzO06apYucr3q9s4IhRiohhHfWDjGi8XgcIU8';
qiniu.conf.SECRET_KEY='yWz8Q_dxvi81X20PZ-h54OjX_Ugbo0ShUZZDWMQ0';

var settings = {
	"dbname": "invitation",
	"host": "127.0.0.1"
};

var getUptoken = function (bucketname) {
	var putPolicy = new qiniu.rs.PutPolicy(bucketname);
	//putPolicy.callbackUrl = callbackUrl;
	//putPolicy.callbackBody = callbackBody;
	//putPolicy.returnUrl = returnUrl;
	//putPolicy.returnBody = returnBody;
	//putpolicy.persistentOps = persistentops;
	//putPolicy.persistentNotifyUrl = persistentNotifyUrl;
	//putPolicy.expires = expires;
	return putPolicy.token();
}

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://'+settings.host+'/'+settings.dbname);

var ThemeSchema = new mongoose.Schema({
	theme_name: String,
	css: String,
	data: String,
	template: String,
	application: String,
	view: String
});
var Theme = mongoose.model('theme',ThemeSchema);
var UserDataSchema = new mongoose.Schema({
	id: Number,
	title: String,
	description: String,
	user: Number,
	site_name: String,
	theme_type: String,
	views: [{view_id: String,data: Object}]
});
var UserData = mongoose.model('data',UserDataSchema);

app.get(/^\/pages\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
    Theme.findOne({theme_name:site_name},function (err, theme){
		if (err) return console.error(err);
	    res.render('page', { 
	    	site_name: site_name,
	    	application_path: theme.application,
	    	css_path: theme.css,
	    	data_path: theme.data,
	    	view_path: theme.view,
	    	template_path: theme.template
	    });
	});
});

app.get(/^\/sites\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
    Theme.findOne({theme_name:site_name},function (err, theme){
		if (err) return console.error(err);
	    res.render('index', { 
	    	site_name: site_name,
	    	application_path: theme.application,
	    	css_path: theme.css,
	    	data_path: theme.data,
	    	view_path: theme.view,
	    	template_path: theme.template
	    });
	});
});

app.get(/^\/upload\/image\/token\/?$/,function(req,res){
    var token = getUptoken('invitation');
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        })
    }
});

app.get(/^\/data\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
    UserData.findOne({theme_type: site_name},function (err, userdata){
		if (err) return console.error(err);
	    res.send(userdata);
	});
});

app.post(/^\/data\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
    var data = JSON.parse(req.body.json);
    UserData.update({theme_type: site_name},data,function (err){
		if (err) return console.error(err);
		res.send({state:1,msg:'success'});
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});