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