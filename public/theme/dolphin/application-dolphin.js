(function(App){

    window.App = App;

    App.initApplication = function(){
        $('.view-wrapper,.view').css('height', $(window).height());
        $('.loading-text').addClass('hidden');
        $('.view-wrapper').removeClass('hidden');
        $('img').each(function() {
            var src = $(this).data('src');
            src && $(this).attr('src', src);
        });

        /**
         * Init Scroller
         */
        App.Scroller = new IScroll('.view-wrapper', {
            momentum: false,
            bounce: false,
            snap: true,
            snapSpeed: 500,
            snapThreshold: 0.1,
            mouseWheel: true,
            eventPassthrough: 'horizontal'
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
    
    // var Collection = Backbone.Collection.extend({
    //     parse: function(response) {
    //         if (response.results != null) {
    //             this.count = response.count;
    //             this.previous = response.previous;
    //             this.next = response.next;
    //             return response.results;
    //         } else {
    //             return response;
    //         }
    //     }
    // });
    
    /*************************************************************/

    // function imageLoaded() {
    //     limg--;
    //     $('.loading-text>span').text(parseInt((1-limg/imageList.length)*100) + '%');
    //     if (limg == 0) {
    //         $('.loading-text').text("点击开始播放");
    //         $('#audio').removeClass('hidden');
    //     }
    // }

    // audio = document.getElementById('audio');
    // audio.addEventListener('playing', function() {
    //     $('#audio').addClass('hidden');
    //     startApp();
    // });
    // audio.src = "img/timelinebg.mp3";
    
    // for (var i=0; i<imageList.length; i++) {
    //     var image = new Image();
    //     image.onload = imageLoaded;
    //     image.src = imageList[i];
    // }
