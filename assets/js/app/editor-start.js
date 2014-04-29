window.App = {};

App.config = {
    APIHost:'http://192.168.1.93:8080',
    viewRoot: $('#page_preview >.view-wrapper'),
    uploadDomain:'http://invitation.qiniudn.com/',
    uploadUrl: 'http://up.qiniu.com'
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
    var page_list = [];

    $('#page_preview').css('height',$(window).height()-88);

    _.forEach(data.views,function(v,index){
        page_list.push(v.view_id);
        var view_name = v.view_id.toLowerCase();
        App.sectionList.push(new 
            (App.View.Section.extend({
                id:view_name,
                template:TPL[view_name]
            }))({model:new App.Model.Page(v)})
        );
    });
    App.bindEvent();
    // if(App.sectionList.length!=0){
    //     $('.view').css('height', $('.view-wrapper').innerHeight());
    //     App.prerenderView(0,App.sectionList[0].callback);
    // }

}

App.bindEvent = function(){
    App.ProgressView = new App.View.Progress({
        el:$('#fullscreen')
    });
    $('#done').click(function(){
        App.ProgressView.show();
        App.ProgressView.displayInfo('更新数据');
        App.ProgressView.displayProgress(0);
        App.SiteData.update({
            success:function(){
                setTimeout(function(){
                    App.ProgressView.displayProgress(50);
                },0);
                setTimeout(function(){
                    App.ProgressView.displayProgress(100);
                },200);
            }
        });
        //image upload
        $.get('/upload/image/token/',function(data){
            App.ProgressView.displayInfo('上传图片');
            App.ProgressView.displayProgress(0);
            var token = data.uptoken;
            var length = $('input[type=file]').length;
            var current = 0;
            var updateProgress = function(){
                current++;
                App.ProgressView.displayProgress(current/length*100);//?????
                if(current==length){
                    $.ajax({  
                        type: "POST",  
                        dataType: "json",  
                        url: "/data/origin",  
                        data: {json:JSON.stringify(App.SiteData.toJSON())},
                        success:function(){
                            App.ProgressView.displayInfo('Complete!');
                            setTimeout(function(){
                                App.ProgressView.hide();
                            },500)
                        }
                    }); 
                }   
            };
            if(length==0){
                length=1;
                current=0;
                updateProgress();
            }
            else{               
                $('input[type=file]').each(function(index,e){
                    if($(e).attr('upload')=='false'){
                        var data_index = $(e).parents('.img').attr('data-index');
                        var view_id = $('section.view').index($(e).parents('.view'));
                        App.SiteData.toJSON().views[view_id].data.img[data_index] = '';
                        updateProgress();     
                    }
                    else{
                        var data_index = $(e).parents('.img').attr('data-index');
                        var view_id = $('section.view').index($(e).parents('.view'));
                        var files = $(e).get(0).files;
                        if (files.length > 0 && token != "") {
                            App.uploadImage(files[0], token,view_id,data_index,function(){
                                updateProgress(); 
                            });
                        }
                        else {
                            updateProgress();
                            console && console.log("form input error");
                        }
                    }
                });
            }
        });
    }); 
}

App.uploadImage = function(f,token,view_id,index,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST',App.config.uploadUrl, true);
    var formData, startDate;
    formData = new FormData();
    formData.append('x:view_id', view_id);
    formData.append('x:index', index);
    formData.append('token', token);
    formData.append('file', f);
    xhr.onreadystatechange = function(response) {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
            var response = JSON.parse(xhr.responseText);
            //更新image url
            var url = App.config.uploadDomain+response.key;
            var views = App.SiteData.toJSON().views;
            views[response['x:view_id']].data.img[response['x:index']] = url;
            if(callback)callback();
        } else if (xhr.status != 200 && xhr.responseText) {
            console.log('error:'+xhr.responseText);
        }
    };
    xhr.send(formData);
};

/**
 * 
App.initSidebar = function(){
    new App.View.Sidebar({
        el:'#page_sidebar',
        model:new App.Model(page_list)
    }).render();
    $('.pages-list-view-item:eq(0)').addClass('active');
}

App.initIscroll = function(){
    //onload结束
    // setTimeout(function(){
    //     App.Scroller = new IScroll('#page_preview');

    //     App.Scroller.on('scrollEnd', function() {
    //         //var sectionList = App.sectionList;
    //         //var page = App.Scroller.currentPage.pageY;
    //         console.log($('#contact').position().top);

    //         // sectionList[page] && sectionList[page].model.trigger('enter');
    //         // sectionList[page+1] && sectionList[page+1].model.trigger('leave');
    //         // sectionList[page-1] && sectionList[page-1].model.trigger('leave');

    //         // if(App.sectionList[page+1]){
    //         //     App.prerenderView(page+1,App.sectionList[page+1].callback);//??
    //         // }
    //         // if(App.sectionList[page-1]){
    //         //     App.prerenderView(page-1,App.sectionList[page-1].callback);//??
    //         // }
    //     });
    // },200);
}

App.preload = function(){
    var data = App.SiteData.attributes || [];
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
 */