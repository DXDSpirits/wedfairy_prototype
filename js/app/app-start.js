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

App.loadScript = function(site_id){
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

App.initDom = function(){
    var data = App.SiteData.attributes || [];
    _.forEach(data.views,function(v,index){
        App.sectionList.push(new (App.View[v.view_id])({
            model:new App.Model.Page(v)
        }));
        App.config.viewRoot.append(App.sectionList[index].render().$el);
    });
    if(App.sectionList.length!=0){
        $('.view').css('height', $('.view-wrapper').innerHeight());
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