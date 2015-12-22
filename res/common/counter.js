;(function(window,$){
	var idRandom=0;
	var counterMap={};
	function mkId(){
		idRandom++;
		return '_'+idRandom+'_';
	}
	function getCounter(id){
		return counterMap[id];
	}
	function setCounter(id,counter){
		counterMap[id]=counter;
	}


	$('#J_content').on('touchstart','.hg-counter i',function(e){
		var p=$(this).parent('.hg-counter');
		var id=p.data('id');
		var couter=getCounter(id);
		if(!couter)return;
		if($(this).hasClass('add')){
			couter.add();
		}else{
			couter.reduce();
		}
		e.preventDefault();
	});
	$('#J_content').on('blur','.hg-counter input',function(){
		var p=$(this).parent('.hg-counter');
		var id=p.data('id');
		var couter=getCounter(id);
		if(!couter)return;
		var val=$(this).val();
		couter.set(val);
	});

	function Counter(config){
		/*
			html:
			<div class="hg-counter prodet-type-counter">
				<i class="reduce">-</i>
				<input type="tel" value="1">
				<i class="add">+</i>
			</div>

			config:{
				ele:element,
				max:10,
				min:1,
				value:1,
				callback:function(){}
			}
		*/
		this.cfg=config;
		this.value=this.cfg.value;
		this.init();
	}

	Counter.prototype.init=function(){
		var ele=$(this.cfg.ele);
		if(this.value){
			ele.find('input').val();
		}
		var id=mkId();
		ele.data('id',id);
		setCounter(id,this);
	}
	
	Counter.prototype.add=function(){
		var ele=$(this.cfg.ele);
		var inp=ele.find('input');
		var i=inp.val();
		i++;
		this.set(i);
	}
	Counter.prototype.reduce=function(){
		var ele=$(this.cfg.ele);
		var inp=ele.find('input');
		var i=inp.val();
		i--;
		this.set(i);
	}

	Counter.prototype.set = function(value){
		if(typeof this.cfg.max != 'undefined'){
			if(value>this.cfg.max){
				value=this.cfg.max;
			}
		}
		if(typeof this.cfg.min != 'undefined'){
			if(value<this.cfg.min){
				value=this.cfg.min;
			}
		}
		var ele=$(this.cfg.ele);
		ele.find('input').val(value);
		this.value=value;
		if(this.cfg.callback){
			this.cfg.callback.call(this,value,this.cfg.ele);
		}
	}

	Counter.prototype.get = function() {
		return this.value;
	};

	$.fn.makeCounter=function(cfg){
		new Counter({
			ele:this,
			max:cfg.max,
			min:cfg.min,
			value:cfg.val,
			callback:cfg.callback
		});
		return this;
	}
})(window,$);