window.Queue = function(viewIndex,callback){
    this.viewIndex = viewIndex;
    this.questCounter = 0;
    this.questArray =[];
    if(typeof callback == 'function'){
        this.callbacks = new Array(callback);
    }
    else if(typeof callback == 'object'){
        this.callbacks = callback;
    }
    else{
        this.callbacks = [];
    }
}

Queue.prototype.pop = function(){
    this.questArray.pop();
    this.questCounter--;
    if(this.questCounter == 0){
        this.end();
    }
}

Queue.prototype.push = function(url){
    this.questArray.push(url);
    this.questCounter++;
}

Queue.prototype.end = function(){
    _.forEach(this.callbacks,function(callback){
        if(typeof callback == 'function'){
            callback();
        }
    });
    App.sectionList[this.viewIndex].isPrerender = true;
    delete this;//???
}

Queue.prototype.start = function(){
    var self = this;
    if(this.questCounter==0){
        this.end();
        return;
    }
    _.forEach(this.questArray,function(url){
        var img = new Image();
        img.onload = function(){
            self.pop();
        }
        img.src = url;
    });
}
$(function(){

window.App = {};

App.config = {
	APIHost:'http://192.168.1.93:8080',
    viewRoot: $('.view-wrapper-inner')
}

App.View = App.View||{};

App.sectionList=[];

App.start = function(){
   App.initDom();
   App.initApplication();
}

App.initDom = function(){

    var data = App.SiteData.attributes || [];
    _.forEach(data,function(v,index){
        App.sectionList.push(new (App.View[v.view_id])({
            model:new App.Model.Page(v)
        }));

        App.config.viewRoot.append(App.sectionList[index].render().$el);
    });

    $('.view').css('height', $('.view-wrapper').innerHeight());

    App.prerenderView(0,App.sectionList[0].callback);
}

App.prerenderView = function(viewIndex,callback){
    if(App.sectionList[viewIndex].isPrerender)return;
    var data = App.SiteData.attributes || [];
    var resource = data[viewIndex].data.img;
    var queue = new Queue(viewIndex,callback);
    _.forEach(resource,function(url){
        queue.push(url);
    });
    queue.start();
}

App.loadFile = function(filetype,filename){
    if (filetype=="script"){
      var fileref=document.createElement('script');
      fileref.setAttribute("type","text/javascript");
      fileref.setAttribute("src", filename);
      var container = document.getElementsByTagName('body')[0];
      container.appendChild(fileref);
    }
    else if (filetype=="css"){
      var fileref=document.createElement("link");
      fileref.setAttribute("rel", "stylesheet");
      fileref.setAttribute("type", "text/css");
      fileref.setAttribute("href", filename);
      var container = document.getElementsByTagName('head')[0];
      container.appendChild(fileref);
    }
    else{
        var fileref={};
    }
    return fileref;
}
App.Router = new (Backbone.Router.extend({
    initialize: function(){
        this.route('', 'index');
        this.route(/^site\/(\w+)$/, 'getSiteData');
    },
    
    index: function() {
        console.log('index');
        this.navigate("/site/dolphin");
    },
    getSiteData: function(site_id) {
        if(typeof sever_data=='undefined'){
            App.SiteData = new App.Model.Site({
                url:App.config.APIHost+'/theme/'+site_id+'/data-'+site_id+'.js'
            });

            App.SiteData.fetch({
                success:function(data){
                    console.log(data);
                }
            });
        }
        else{
            App.SiteData = new App.Model.Site(sever_data.views);
            var counter = 4;
            var callback = function(){
                counter--;
                if(counter==0){
                    App.start();
                }
            }
            var theme_id = sever_data.theme_type;
            App.loadFile('css','/theme/'+theme_id+'/theme-'+site_id+'.css').onload=callback;
            App.loadFile('script','/theme/'+theme_id+'/template-'+site_id+'.js').onload=callback;
            App.loadFile('script','/theme/'+theme_id+'/view-'+site_id+'.js').onload=callback;
            App.loadFile('script','/theme/'+theme_id+'/application-'+site_id+'.js').onload=callback;
        }
    }
}))();
App.Model = Backbone.Model.extend({
    fetch: function(options) {
        options = options || {};
        if (options.delay) {
            var self = this;
            setTimeout(function() {
                Backbone.Model.prototype.fetch.call(self, options);
            }, options.delay);
        } else {
            return Backbone.Model.prototype.fetch.call(this, options);
        }
    },
    url: function() {
        if (this.attributes.url) {
            return this.attributes.url;
        } else {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
        }
    }
});

App.Model.Site = App.Model.extend({});

App.Model.Page = App.Model.extend({
    view:"",
    controller:"",
    data:{},
    img:[]
});
App.View = Backbone.View.extend({
    initialize: function() {
        if (this.initView) this.initView();
    },
    displayError: function($el, text) {
        try {
            var error = JSON.parse(text);
            for (var k in error) { $el.html(error[k]);  break; };
        } catch (e) {
            $el.text(text || 'Error');
        }
    }
});

App.View.Section = App.View.extend({
    template: Mustache.compile(""),
    isPrerender:false,
    tagName:'section',
    className:'view text-center',
    initView: function() {
        if (this.model) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'enter', this.onEnter);
            this.listenTo(this.model, 'leave', this.onLeave);
        }
        if(this.initPageView){
            this.initPageView();
        }
        _.bindAll(this,"onEnter","onLeave","callback");
    },
    render:function(){
        this.renderTemplate(this.model.get('data').text);
        return this;
    },
    renderTemplate: function(attrs){
        this.$el.html(this.template(attrs || {}));
    },
    onEnter: function() {},
    onLeave: function() {},
    callback:function() {
        console.log('complete');
    }
});
});