App.Router = new (Backbone.Router.extend({
    initialize: function(){
        this.route('', 'index');
        this.route(/^site\/(\w+)\/$/, 'getSiteData');
    },
    index: function() {
        //检验用户登录信息
        
        //跳转登录注册页面
    },
    getSiteData: function(site_name) {
        if(typeof sever_data=='undefined'){
            App.SiteData = new App.Model.Site({});
            App.SiteData.fetch({
                url:'http://192.168.1.7:9000/sites/site/'+site_name+'/',
                success:function(data){
                    sever_data=data.toJSON();
                    App.loadScript(site_name);
                }
            });
        }
        else{
            App.SiteData = new App.Model.Site(sever_data);
            App.loadScript(site_name);
        }
    }
}))();