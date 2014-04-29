MeiweiApp.initSync = function() {
    var authToken = localStorage.getItem('auth-token');
    var originalSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        options.timeout = options.timeout || MeiweiApp.configs.ajaxTimeout;
        _.extend((options.headers || (options.headers = {})), { 'Accept-Language': MeiweiApp.getLang() });
        if (authToken) {
            _.extend(options.headers, { 'Authorization': 'Token ' + authToken });
        }
        if (options.nocache) {
            _.extend(options.headers, { 'Cache-Control': 'no-cache' });
        }
        if (options.url) {
            options.url = options.url.replace(/^(?:http|https)\:\/{2}[a-zA-Z0-9\-_\.]+(?:\:[0-9]{1,4})?(.*)/,
                MeiweiApp.configs.APIHost + '$1');
        }
        return originalSync.call(model, method, model, options);
    };
    MeiweiApp.TokenAuth = {
        get: function() {
            return _.clone(authToken);
        },
        set: function(token) {
            authToken = _.clone(token);
            localStorage.setItem('auth-token', authToken);
        },
        clear: function() {
            authToken = null;
            localStorage.removeItem('auth-token');
        }
    };
};



MeiweiApp.Models.Profile = MeiweiApp.Model.extend({
    urlRoot: MeiweiApp.configs.APIHost + '/members/profile/',
});

MeiweiApp.Models.Member = MeiweiApp.Model.extend({
    urlRoot: 'http://192.168.1.7:9000' + '/members/member/',
});

App.me = new (MeiweiApp.Models.Member.extend({
    initialize: function() {
        this.profile = new MeiweiApp.Models.Profile(this.get('profile'));
        this.on('change:profile', function() {
            this.profile.set(this.get('profile'));
        }, this);
        this.on('login', function() {
            this.fetch();
        });
    },
    parse: function(response) {
        return _.isArray(response.results) ? response.results[0] : response;
    },
    login: function(auth, options) {
        this.clear().set(auth);
        options = options || {};
        options.url = MeiweiApp.configs.APIHost + '/members/login/';
        var success = options.success;
        options.success = function(model, response, options) {
            MeiweiApp.TokenAuth.set(response.token);
            if (success) success(model, response, options);
            model.trigger('login');
        };
        this.save({}, options);
    },
    logout: function(callback) {
        this.clear();
        MeiweiApp.TokenAuth.clear();
        this.trigger('logout');
    },
    register: function(auth, options) {
        var newUser = new MeiweiApp.Models.Member();
        newUser.save({ username: auth.username, password: auth.password }, {
            success: options.success,
            error: options.error,
            url: MeiweiApp.configs.APIHost + '/members/register/'
        });
    },
    changePassword: function(password, options) {
        if (!password) return;
        this.set({password: password});
        options = options || {};
        options.url = this.url() + 'change_password/';
        Backbone.sync('update', this, options);
    }
}));