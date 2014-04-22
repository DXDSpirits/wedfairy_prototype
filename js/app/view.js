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

App.View.Section = App.View.extend({
    template: Mustache.compile(""),
    isPrerender:false,
    tagName:'section',
    className:'view text-center',
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
    },
    render:function(){
        this.renderTemplate(this.model.get('data').text);
        return this;
    },
    renderTemplate: function(attrs){
        this.$el.html(this.template(attrs || {}));
    },
    onEnter: function() {},
    onLeave: function() {},
    callback:function() {
        console.log('complete');
    }
});