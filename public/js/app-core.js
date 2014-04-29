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
window.App = {};

App.config = {
	APIHost:'http://192.168.1.93:8080',
    viewRoot: $('.view-wrapper')
}

App.View = App.View||{};

App.sectionList=[];

App.start = function(){
    if(typeof sever_data=='undefined'){
        var site_name= 'origin';
        App.SiteData = new App.Model.Site({});
        App.SiteData.fetch({
            url:'/data/'+site_name+'/',
            success:function(data){
                // sever_data=data.toJSON();
                // App.loadScript(site_name);
                App.initDom();
            }
        });
    }
    else{
        App.SiteData = new App.Model.Site(sever_data);
        App.initDom();
    }
    FastClick.attach(document.body);
    //App.initApplication();
}

App.initDom = function(){
    var data = App.SiteData.attributes || [];
    _.forEach(data.views,function(v,index){
        var view_name = v.view_id.toLowerCase();
        App.sectionList.push(new 
            (App.View.Section.extend({
                template:TPL[view_name]
            }))({model:new App.Model.Page(v)})
        );
        App.config.viewRoot.append(App.sectionList[index].render().$el);
    });
    if(App.sectionList.length!=0){
        App.prerenderView(0,App.sectionList[0].callback);
    }
}

App.prerenderView = function(viewIndex,callback){
    if(App.sectionList[viewIndex].isPrerender)return;
    var data = App.SiteData.get('views') || [];
    var resource = data[viewIndex].data.img;
    var queue = new Queue(viewIndex,callback);
    _.forEach(resource,function(url){
        queue.push(url);
    });
    queue.start();
}
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

App.Collection = Backbone.Collection.extend({
    parse: function(response) {
        if (response.results != null) {
            this.count = response.count;
            this.previous = response.previous;
            this.next = response.next;
            return response.results;
        } else {
            return response;
        }
    }
});

App.Model.Site = App.Model.extend({
    parse:function(data){
        // for(var index in data.views){
        //     var string=data.views[index].data;
        //     data.views[index].data=JSON.parse(string);
        // }
        return data;
    },
    update:function(option){
        var origin_data = this.toJSON();
        _.forEach(origin_data.views,function(e,index){
            var view_id = e.view_id;
            var text = {};
            $('#'+view_id).find('[data-edit=text-enable]').not("[data-paragraph]").each(function(index,e){
                text[$(e).attr('data-field')]=e.innerText;
            });
            var paragraph = [];
            $('#'+view_id+' [data-edit=paragraph-enable]').find('[data-item]').each(function(index,e){
                var item={};
                $(e).find('[data-edit=text-enable]').each(function(index,p){
                    item[$(p).attr('data-field')]=p.innerText;
                });
                if(!_.isEmpty(item)){
                    paragraph.push(item);
                }
            });
            if(paragraph.length!=0){
                text['paragraph']=paragraph;
            }
            e.data.text=text;
        });
        if(option.success)option.success();
    },
    save:function(){
        console.log(this.toJSON());
    }
});

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
        var img = this.model.get('data').img;
        if(img.length!=0){
            this.$('[data-index]').each(function(index,e){
                if($(e).attr('class')=='img'){
                    if(typeof img[index]!='undefined'&&img[index]){
                        $(e).children('img').get(0).src = img[index];
                    }
                }
            });
        }
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
