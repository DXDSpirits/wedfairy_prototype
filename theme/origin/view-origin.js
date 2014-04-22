(function(App){

    window.App = App;

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
            this.renderTemplate(this.model.get('data'));
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
    
    /**
     * View Hero
     */
    App.View.Hero = App.View.Section.extend({
        template:TPL['hero'],
        id:'Hero'
    });

    /**
     * View TheGirl
     */
    App.View.TheGirl = App.View.Section.extend({
        template:TPL['thegirl'],
        id:'TheGirl',
        initPageView: function() {
            _.bindAll(this, 'switchGirlPhoto', 'resetGirlPhoto');
        },
        switchGirlPhoto: function() {
            this.$('.img-the-girl').addClass('switch');
        },
        resetGirlPhoto: function() {
            this.$('.img-the-girl').removeClass('switch');
        },
        onEnter: function() {
            this.$('.shy-girl').addClass('invisible');
            this.$('.love-cross').addClass('crossed');
        },
        onLeave: function() {
            this.$('.shy-girl').removeClass('invisible');
            this.$('.love-cross').removeClass('crossed');
        }
    });

    /**
     * View TheBigDay
     */
    App.View.TheBigDay = App.View.Section.extend({
        template:TPL['thebigday'],
        id:'TheBigDay',
        onEnter: function() {
            var $timeline = this.$('.timeline');
            var gap = $timeline.outerHeight() - this.$el.innerHeight();
            var translate = 'translate3d(0, ' + (-gap) + 'px, 0)';
            $timeline.addClass('animate');
            $timeline.css({
                '-webkit-transform': translate,
                'transform': translate
            });
            //scroller.disable();
            //setTimeout(function() { scroller.enable(); }, 10000);
        },
        onLeave: function() {
            var $timeline = this.$('.timeline');
            $timeline.removeClass('animate');
            $timeline.css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        }
    });

    /**
     * View Proposal
     */
    App.View.Proposal = App.View.Section.extend({
        template:TPL['proposal'],
        id:'Proposal',
        onEnter: function() {
            this.$('.rose-cover').addClass('animate');
        },
        onLeave: function() {
            this.$('.rose-cover').removeClass('animate');
        }
    });

    /**
     * View GoodMorning
     */
    App.View.GoodMorning = App.View.Section.extend({
        template:TPL['goodmorning'],
        id:'GoodMorning'
    });

    /**
     * View GoodNight
     */
    App.View.GoodNight = App.View.Section.extend({
        template:TPL['goodnight'],
        id:'GoodNight'
    });

    /**
     * View LaVie
     */
    App.View.LaVie = App.View.Section.extend({
        template:TPL['lavie'],
        id:'LaVie',
        onEnter: function() {
            this.$('.cover').addClass('flip');
            this.$('.bouquet').addClass('slidein');
        },
        onLeave: function() {
            this.$('.cover').removeClass('flip');
            this.$('.bouquet').removeClass('slidein');
        }
    });

    /**
     * View Honeymoon
     */
    App.View.Honeymoon = App.View.Section.extend({
        template:TPL['honeymoon'],
        id:'Honeymoon'
    });

    /**
     * View Contact
     */
    App.View.Contact = App.View.Section.extend({
        template:TPL['contact'],
        id:'Contact'
    });

})(window.App||{});