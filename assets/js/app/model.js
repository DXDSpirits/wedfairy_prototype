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