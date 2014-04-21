(function(App){
    window.App = App;

    App.config = {
        viewRoot: $('.view-wrapper-inner')
    }

    App.View = {};

    App.sectionList=[];

    App.start = function(){
       App.initDom();
       App.initView();
       App.initApplication();
    }

    App.initDom = function(){
        var data = sever_data || [];
        _.forEach(data,function(v){
            App.config.viewRoot.append("<section class=\"view text-center\" id=\""+v.view+"\"></section>");
        });
    }

    App.initApplication = function(){
        $('.view').css('height', $('.view-wrapper').innerHeight());

        var data = sever_data || [];
        _.forEach(data,function(v){
            App.sectionList.push(App.View[v.view]);
        });

        /**
         * Init Scroller
         */
        App.Scroller = new IScroll('.view-wrapper', {
            momentum: false,
            bounce: false,
            snap: true,
            snapSpeed: 500,
            mouseWheel: true,
            // indicators: [{
            //     el: document.getElementById('nightsky'),
            //     resize: false,
            //     ignoreBoundaries: true,
            //     speedRatioY: 0.5
            // }]
        });
        
        App.Scroller.on('scrollEnd', function() {
            var sectionList = App.sectionList;
            var page = App.Scroller.currentPage.pageY;
            sectionList[page] && sectionList[page].onEnter();
            sectionList[page+1] && sectionList[page+1].onLeave();
            sectionList[page-1] && sectionList[page-1].onLeave();
            if(App.sectionList[page+1]){
                App.prerenderView(page+1,App.sectionList[page+1].callback);//??
            }
            if(App.sectionList[page-1]){
                App.prerenderView(page-1,App.sectionList[page-1].callback);//??
            }
        });

        /**
         * Init First Page
         */
        App.prerenderView(0,App.sectionList[0].callback);

        for(var index in data){
            App.sectionList[index].renderTemplate(data[index].data);
        }
        App.Scroller.goToPage(0, 0);
    }

    /**
     * App utils
     */
    App.prerenderView = function(viewIndex,callback){
        var data = sever_data || [];
        var resource = data[viewIndex].img;
        var queue = new Queue(callback);
        _.forEach(resource,function(url){
            queue.push(url);
        });
        queue.start();
    }

})(window.App||{});