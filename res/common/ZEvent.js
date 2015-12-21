;(function(){
	ZEvent=function(){
		this.listeners={};
	}
	/*name:监听事件的名字*/
	ZEvent.prototype.on=function(name,listener){
		if(!this.listeners[name]){
			this.listeners[name]=[];
		}
		this.listeners[name].push(listener);
		return this;
	}
	/*event：{
		name:'',
		v1:'',//自定义
		v2:''//自定义
	}
	如果传入的只是字符串那么默认会生成一个事件对象：{name:xxx}
	*/
	ZEvent.prototype.trigger=function(event){
		if(typeof event == 'string'){
			event={
				name:event
			}
		}
		var list=this.listeners[event.name];
		if(list){
			for(var i=0;i<list.length;i++){
				list[i].call(this,event);
			}
		}
		return this;
	}
	ZEvent.prototype.removeListener=function(name){
		delete this.listeners[name];
		return this;
	}
})();
