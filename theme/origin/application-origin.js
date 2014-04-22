(function(App){

    window.App = App;

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
    
})(window.App||{});