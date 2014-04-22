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