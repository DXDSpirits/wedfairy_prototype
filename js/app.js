(function(App){

    window.App = App;

    App.config = {
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

        /**
         * Init First Page
         */
        App.prerenderView(0,App.sectionList[0].callback);
    }

    App.initApplication = function(){
        /**
         * Init Scroller
         */
        App.Scroller = new IScroll('.view-wrapper', {
            momentum: false,
            bounce: false,
            snap: true,
            snapSpeed: 500,
            mouseWheel: true
        });
        
        App.Scroller.on('scrollEnd', function() {
            var sectionList = App.sectionList;
            var page = App.Scroller.currentPage.pageY;

            sectionList[page] && sectionList[page].model.trigger('enter');
            sectionList[page+1] && sectionList[page+1].model.trigger('leave');
            sectionList[page-1] && sectionList[page-1].model.trigger('leave');

            if(App.sectionList[page+1]){
                App.prerenderView(page+1,App.sectionList[page+1].callback);//??
            }
            if(App.sectionList[page-1]){
                App.prerenderView(page-1,App.sectionList[page-1].callback);//??
            }
        });
        
        App.Scroller.goToPage(0, 0);
    }

    /**
     * App utils
     */
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

})(window.App||{});