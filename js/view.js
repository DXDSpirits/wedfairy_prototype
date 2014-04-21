(function(App){

    window.App = App;

    App.View = App.View||{};

    App.View.Section = Backbone.View.extend({
        template: Mustache.compile(""),
        isPrerender:false,
        tagName:'section',
        className:'view text-center',
        render: function(attrs){
            this.$el.html(this.template(attrs || {}));
            return this;
        },
        onEnter: function() {},
        onLeave: function() {},
        callback:function() {
            console.log('complete');
        }
    });
    /**
     * 加model，改成model出发onenter，onleave
     */
    
    /**
     * View Hero
     */
    App.View.Hero = new (App.View.Section.extend({
        template:TPL['hero'],
        id:'Hero'
    }))();

    /**
     * View TheGirl
     */
    App.View.TheGirl = new (App.View.Section.extend({
        template:TPL['thegirl'],
        id:'TheGirl',
        initialize: function() {
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
            //scroller.on('scrollStart', this.switchGirlPhoto);
            //scroller.on('scrollEnd', this.resetGirlPhoto);
        },
        onLeave: function() {
            this.$('.shy-girl').removeClass('invisible');
            this.$('.love-cross').removeClass('crossed');
        }
    }))();

    /**
     * View TheBigDay
     */
    App.View.TheBigDay = new (App.View.Section.extend({
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
    }))();

    /**
     * View Proposal
     */
    App.View.Proposal = new (App.View.Section.extend({
        template:TPL['proposal'],
        id:'Proposal',
        onEnter: function() {
            this.$('.rose-cover').addClass('animate');
        },
        onLeave: function() {
            this.$('.rose-cover').removeClass('animate');
        }
    }))();

    /**
     * View GoodMorning
     */
    App.View.GoodMorning = new (App.View.Section.extend({
        template:TPL['goodmorning'],
        id:'GoodMorning'
    }))();

    /**
     * View GoodNight
     */
    App.View.GoodNight = new (App.View.Section.extend({
        template:TPL['goodnight'],
        id:'GoodNight'
    }))();

    /**
     * View LaVie
     */
    App.View.LaVie = new (App.View.Section.extend({
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
    }))();

    /**
     * View Honeymoon
     */
    App.View.Honeymoon = new (App.View.Section.extend({
        template:TPL['honeymoon'],
        id:'Honeymoon'
    }))();

    /**
     * View Contact
     */
    App.View.Contact = new (App.View.Section.extend({
        template:TPL['contact'],
        id:'Contact'
    }))();

})(window.App||{});