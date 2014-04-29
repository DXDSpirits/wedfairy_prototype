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