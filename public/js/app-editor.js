window.Queue = function(viewIndex,callback){
    this.viewIndex = viewIndex;
    this.questCounter = 0;
    this.questArray =[];
    if(typeof callback == 'function'){
        this.callbacks = new Array(callback);
    }
    else if(typeof callback == 'object'){
        this.callbacks = callback;
    }
    else{
        this.callbacks = [];
    }
}

Queue.prototype.pop = function(){
    this.questArray.pop();
    this.questCounter--;
    if(this.questCounter == 0){
        this.end();
    }
}

Queue.prototype.push = function(url){
    this.questArray.push(url);
    this.questCounter++;
}

Queue.prototype.end = function(){
    _.forEach(this.callbacks,function(callback){
        if(typeof callback == 'function'){
            callback();
        }
    });
    App.sectionList[this.viewIndex].isPrerender = true;
    delete this;//???
}

Queue.prototype.start = function(){
    var self = this;
    if(this.questCounter==0){
        this.end();
        return;
    }
    _.forEach(this.questArray,function(url){
        var img = new Image();
        img.onload = function(){
            self.pop();
        }
        img.src = url;
    });
}
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
App.Model = Backbone.Model.extend({
    fetch: function(options) {
        options = options || {};
        if (options.delay) {
            var self = this;
            setTimeout(function() {
                Backbone.Model.prototype.fetch.call(self, options);
            }, options.delay);
        } else {
            return Backbone.Model.prototype.fetch.call(this, options);
        }
    },
    url: function() {
        if (this.attributes.url) {
            return this.attributes.url;
        } else {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
        }
    }
});

App.Collection = Backbone.Collection.extend({
    parse: function(response) {
        if (response.results != null) {
            this.count = response.count;
            this.previous = response.previous;
            this.next = response.next;
            return response.results;
        } else {
            return response;
        }
    }
});

App.Model.Site = App.Model.extend({
    parse:function(data){
        // for(var index in data.views){
        //     var string=data.views[index].data;
        //     data.views[index].data=JSON.parse(string);
        // }
        return data;
    },
    update:function(option){
        var origin_data = this.toJSON();
        _.forEach(origin_data.views,function(e,index){
            var view_id = e.view_id;
            var text = {};
            $('#'+view_id).find('[data-edit=text-enable]').not("[data-paragraph]").each(function(index,e){
                text[$(e).attr('data-field')]=e.innerText;
            });
            var paragraph = [];
            $('#'+view_id+' [data-edit=paragraph-enable]').find('[data-item]').each(function(index,e){
                var item={};
                $(e).find('[data-edit=text-enable]').each(function(index,p){
                    item[$(p).attr('data-field')]=p.innerText;
                });
                if(!_.isEmpty(item)){
                    paragraph.push(item);
                }
            });
            if(paragraph.length!=0){
                text['paragraph']=paragraph;
            }
            e.data.text=text;
        });
        if(option.success)option.success();
    },
    save:function(){
        console.log(this.toJSON());
    }
});

App.Model.Page = App.Model.extend({
    view:"",
    controller:"",
    data:{},
    img:[]
});
App.View = Backbone.View.extend({
    initialize: function() {
        if (this.initView) this.initView();
    },
    displayError: function($el, text) {
        try {
            var error = JSON.parse(text);
            for (var k in error) { $el.html(error[k]);  break; };
        } catch (e) {
            $el.text(text || 'Error');
        }
    }
});

App.View.Sidebar = App.View.extend({
    events:{
        'click .pages-list-view-item':'jumpToPage'
    },
    initView: function() {
        if (this.model) {
            this.listenTo(this.model, 'change', this.render);
        }
        //_.bindAll(this,"onEnter","onLeave","callback");
    },
    jumpToPage:function(e){
        var index = this.$('.pages-list-view-item').removeClass('active').index(e.target);
        $(e.target).addClass('active');
        App.Scroller.scrollToElement(document.querySelector('#'+$(e.target).text().toLowerCase()));
    },
    render:function(){
        var $list=[];
        _.forEach(this.model.attributes,function(d,index){
            $list.push('<div class="pages-list-view-item" data-page="'+d+'">'+index+'</div>');
        })
        this.$el.html($list);
        return this;
    }
});

App.View.Progress = App.View.extend({
    displayInfo:function(action){
        this.$('.info>.title').text(action);
    },
    displayProgress:function(number){
        this.$('.info>.progressbar').text(number+'%');
    },
    show:function(){
        this.$el.addClass('show');
    },
    hide:function(){
        this.$el.removeClass('show');
    }
});

App.View.Section = App.View.extend({
    events:{
        'click [data-edit=text-enable]':'editText',
        'click [data-edit=image-enable]':'showButtonGroup',
        'click [data-edit=image-enable] .empty':'clearImage',
        'change [data-edit=image-enable] input[type=file]':'changeImage',
        'click .item-remove':'removeItem',
        'click .item-plus':'addItem'
    },
    template: Mustache.compile(""),
    isPrerender:false,
    editText:function(e){
        $('.tag-group').hide();
        $(e.currentTarget).focus();
        $(e.currentTarget).select();
        var selection=window.getSelection(); 
        selection.extend (selection.focusNode, selection.focusNode.textContent.length);
    },
    showButtonGroup:function(e){
        $('.tag-group').hide();
        if($(e.currentTarget).find('.tag-group').length==0){
            $(e.currentTarget).prepend('<div class="tag-group"><div class="tag change">变更<input type="file"></div><div class="tag empty">还原</div></div>').show();
        }
        else{
            $(e.currentTarget).find('.tag-group').show();
        }
    },
    changeImage:function(e){
        $(e.currentTarget).removeAttr('upload');
        var files = !!$(e.currentTarget).get(0).files ? $(e.currentTarget).get(0).files : [];
        if(files[0]){
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            var $el=$(e.currentTarget).parents('[data-edit=image-enable]');
            reader.onloadend = function(e){
                var imageData = e.currentTarget.result;
                $el.find('img').get(0).src=imageData;
            } 
        }
    },
    clearImage:function(e){
        var image = $(e.currentTarget).parent().siblings('img');
        $(e.currentTarget).siblings('.change').find('input').attr('upload','false');
        image.attr('src',image.attr('data-src'));
    },
    removeItem:function(e){
        $(e.currentTarget).parent().remove();
    },
    addItem:function(e){
        $(this.paragraphItemTemplate).insertBefore($(e.currentTarget).parent());
    },
    initView: function() {
        if (this.model) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'enter', this.onEnter);
            this.listenTo(this.model, 'leave', this.onLeave);
        }
        if(this.initPageView){
            this.initPageView();
        }
        _.bindAll(this,"onEnter","onLeave","callback");

        App.config.viewRoot.append(this.render().$el);
        this.renderEditorInterface();
    },
    render:function(){
        this.renderTemplate(this.model.get('data').text);
        var img = this.model.get('data').img;
        if(img.length!=0){
            this.$('[data-index]').each(function(index,e){
                if($(e).attr('class')=='img'){
                    if(typeof img[index]!='undefined'&&img[index]){
                        $(e).children('img').get(0).src = img[index];
                    }
                }
            });
        }
        return this;
    },
    renderTemplate: function(attrs){
        this.$el.html(this.template(attrs || {}));
    },
    renderEditorInterface:function(){
        var self = this;
        this.$el.find('[data-edit=text]').each(function(index,e){
            $(e).attr('contentEditable',true);
            $(e).attr('data-edit','text-enable');
        });

        this.$el.find('[data-edit=image]').each(function(index,e){
            $(e).attr('data-edit','image-enable');
        });

        this.$el.find('[data-item]').each(function(index,e){
            $(e).append('<div class="item-remove">-</div>');
        });

        this.$el.find('[data-edit=paragraph]').each(function(index,e){
            $(e).attr('data-edit','paragraph-enable');
            self.paragraphItemTemplate = '<div data-item>'+self.generateTemplate($(e).find('[data-item]').get(0).innerHTML)+'</div>';
            $(e).append('<div data-item><div class="item-plus">+</div></div>');
        });

    },
    generateTemplate:function(o){
        var tmp = o.replace(/(>).*?(<)/g,'$1$2');
        return tmp.substring(0,tmp.length-6)+'-</div>';
    },
    onEnter: function() {},
    onLeave: function() {},
    callback:function() {
        console.log('complete');
    }
});
