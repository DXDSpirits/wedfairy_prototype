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

    var data = sever_data || [];
    _.forEach(data,function(v,index){
        App.sectionList.push(new (App.View[v.view])({
            model:new App.Model.Page(v)
        }));

        App.config.viewRoot.append(App.sectionList[index].render().$el);
    });

    $('.view').css('height', $('.view-wrapper').innerHeight());

    App.prerenderView(0,App.sectionList[0].callback);
}

App.prerenderView = function(viewIndex,callback){
    if(App.sectionList[viewIndex].isPrerender)return;
    var data = sever_data || [];
    var resource = data[viewIndex].img;
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