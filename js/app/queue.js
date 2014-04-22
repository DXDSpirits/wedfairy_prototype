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