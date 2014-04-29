var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY='Dl9yzO06apYucr3q9s4IhRiohhHfWDjGi8XgcIU8';
qiniu.conf.SECRET_KEY='yWz8Q_dxvi81X20PZ-h54OjX_Ugbo0ShUZZDWMQ0';

var settings = {
	"cookieSecret": "invitation",
	"db": "invitation",
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

var mongodb = require('mongodb');
var server = new mongodb.Server(settings.host,27017,{auto_reconnect:true});
var DB = new mongodb.Db(settings.db,server,{safe:true});

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }
// 
app.get(/^\/pages\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
	DB.open(function (err, db) {
		if (err) {
			return false;
		}
		db.collection('theme', function (err, collection) {
			if (err) {
				db.close();
				return false;
			}
			collection.findOne({theme_name: site_name},
				function (err, theme){
			        db.close();
			        if (err) {
			          return false;
			        }
			        else{
					    res.render('page', { 
					    	site_name: site_name,
					    	application_path: theme.application,
					    	css_path: theme.css,
					    	data_path: theme.data,
					    	view_path: theme.view,
					    	template_path: theme.template
					    });
			        }
		      	}
	      	);
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

app.get(/^\/sites\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
	DB.open(function (err, db) {
		if (err) {
			return false;
		}
		db.collection('theme', function (err, collection) {
			if (err) {
				db.close();
				return false;
			}
			collection.findOne({theme_name: site_name},
				function (err, theme){
			        db.close();
			        if (err) {
			          return false;
			        }
			        else{
					    res.render('index', { 
					    	site_name: site_name,
					    	application_path: theme.application,
					    	css_path: theme.css,
					    	data_path: theme.data,
					    	view_path: theme.view,
					    	template_path: theme.template
					    });
			        }
		      	}
	      	);
		});
	});
});

app.get(/^\/data\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
	DB.open(function (err, db) {
		if (err) {
			return false;
		}
		db.collection('data', function (err, collection) {
			if (err) {
				db.close();
				return false;
			}
			collection.findOne({theme_type: site_name},
				function (err, theme){
			        db.close();
			        if (err) {
			          return false;
			        }
			        else{
					    res.send(theme);
			        }
		      	}
	      	);
		});
	});
});

app.post(/^\/data\/(\w+)\/?$/, function(req, res){
    var site_name = req.params[0];
	DB.open(function (err, db) {
		if (err) {
			return false;
		}
		db.collection('data', function (err, collection) {
			if (err) {
				db.close();
				return false;
			}
			var data = JSON.parse(req.body.json);
			console.log(data);
			collection.update({theme_type: site_name},{
				id:data.id,
				title:data.title,
				description:data.site_description,
				user:data.user,
				site_name:data.site_name,
				theme_type:data.theme_type,
				views:data.views
			},function (err, theme){
			        db.close();
			        if (err) {
			        	console.log(err);
			          return false;
			        }
			        else{
			        	res.json('success');
			        }
		      	}
	      	);
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});