(function(App){

    window.App = App;
   
    /**
     * View Hero
     */
    App.View.Hero = App.View.Section.extend({
        template:TPL['hero'],
        id:'hero'
    });

    /**
     * View TheGirl
     */
    App.View.TheGirl = App.View.Section.extend({
        template:TPL['thegirl'],
        id:'thegirl',
        onEnter: function() {
            this.$('.shy-girl').addClass('invisible');
            this.$('.love-cross').addClass('crossed');
        },
        onLeave: function() {
            this.$('.shy-girl').removeClass('invisible');
            this.$('.love-cross').removeClass('crossed');
        },
        play: function() {
            var lines = this.$('.hesays').children();
            lines.css('opacity', 0);
            var next = function(i) {
                var line = lines[i];
                if (!line) return;
                var duration = line.innerText.length * 170;
                $(line).animate({ opacity: 1 }, duration, function() { next(i+1); });
            };
            setTimeout(function() {
                next(0);
            }, 1000);
        }
    });

    /**
     * View Story
     */
    App.View.Story = App.View.Section.extend({
        template:TPL['story'],
        id:'story',
        onEnter: function() {
            var $timeline = this.$('.timeline');
            var gap = $timeline.outerHeight() - this.$el.innerHeight();
            var translate = 'translate3d(0, ' + (-gap-300) + 'px, 0)';
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
     * View Wedding
     */
    App.View.Wedding = App.View.Section.extend({
        template:TPL['wedding'],
        id:'wedding',
        onEnter: function() {
            this.$('.rose-cover').addClass('animate');
            this.$('.the-ring').addClass('animate');
        },
        onLeave: function() {
            this.$('.rose-cover').removeClass('animate');
            this.$('.the-ring').removeClass('animate');
        },
        play: function() {
            var lines = this.$('>header').children();
            lines.css('opacity', 0);
            var next = function(i) {
                var line = lines[i];
                if (!line) return;
                var duration = line.innerText.length * 250;
                $(line).animate({ opacity: 1 }, duration, function() { next(i+1); });
            };
            setTimeout(function() {
                next(0);
            }, 2000);
        }
    });

    /**
     * View LaVie
     */
    App.View.LaVie = App.View.Section.extend({
        template:TPL['lavie'],
        id:'lavie',
        events: {
            'click .gallery img': 'previewImage'
        },
        previewImage: function(e) {
            var $img = $(e.currentTarget);
            window.WeixinJSBridge && window.WeixinJSBridge.invoke('imagePreview', {
                current: $img[0].src,
                urls: _.map($img.siblings('img').andSelf(), function(item) { return item.src; })
            });
        },
        onEnter: function() {
            this.$('.gallery-inner').removeClass('animate').css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        },
        onLeave: function() {
            this.$('.gallery-inner').removeClass('animate').css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        },
        play: function() {
            var outerWidth = this.$('.gallery').innerWidth();
            var innerWidth = _.reduce(this.$('.gallery-inner').children(), function(a,b){return a+$(b).outerWidth();}, 0);
            var translate = 'translate3d(' + (outerWidth - innerWidth) + 'px, 0, 0)';
            this.$('.gallery-inner').addClass('animate').css({
                '-webkit-transform': translate,
                'transform': translate
            });
        }
    });

    /**
     * View Wish
     */
    App.View.Wish = App.View.Section.extend({
        template:TPL['wish'],
        id:'wish',
        onEnter: function() {
            this.$('.cover').addClass('flip');
            this.$('.bouquet').addClass('slidein');
            $('.copyright').removeClass('hidden');
        },
        onLeave: function() {
            this.$('.cover').removeClass('flip');
            this.$('.bouquet').removeClass('slidein');
            $('.copyright').addClass('hidden');
        }
    });

    /**
     * View Contact
     */
    App.View.Contact = App.View.Section.extend({
        template:TPL['contact'],
        id:'contact',
        events: {
            'submit form': 'sendMessage'
        },
        initPageView: function() {
            var API = 'http://api.toplist.oatpie.com/lovemessages/message/';
            var Message = Backbone.Model.extend({ urlRoot: API });
            var Messages = Backbone.Collection.extend({ url: API, model: Message });
            this.messages = new Messages();
            this.listenTo(this.messages, 'add', this.addMessage);
            this.listenTo(this.messages, 'reset', this.renderMessages);
        },
        renderMessages: function() {
            var $list = [];
            this.messages.forEach(function(item) {
                $list.push($('<p></p>').text(item.get('content')).prepend('<i class="fa fa-heart-o"></i>'));
            });
            this.$('.messages').html($list);
        },
        addMessage: function(item) {
            var $msg = $('<p></p>').text(item.get('content')).prepend('<i class="fa fa-heart-o"></i>')
                                   .css('opacity', 0).animate({opacity: 1})
            this.$('.messages').prepend($msg);
        },
        sendMessage: function(e) {
            if (e.preventDefault) e.preventDefault();
            var content = this.$('textarea').val();
            if (content) {
                this.messages.create({ site: 1, content: content });
            }
        },
        onEnter: function() {
            this.messages.fetch({reset: true, data: {site: 1}});
            $('.copyright').removeClass('hidden');
        },
        onLeave: function() {
            this.$('textarea').blur();
            $('.copyright').addClass('hidden');
        }
    });

})(window.App||{});