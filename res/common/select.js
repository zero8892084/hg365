;(function($){
	
	ZSelect=function(cfg){
		/*
			cfg:{
				label:"左边显示的标签",
				value:"默认值",
				element:obj
			}
		*/
		ZEvent.call(this);
		var _th=this;
		this.cfg=cfg;
		var html='<span class="hg-label">'+cfg.label+'</span>'+
			 '<span class="hg-select-value hg-text"></span>'+
			 '<span class="hg-iconfont hg-iconfont-rarrow"></span>';
		var ele=$(cfg.element);
		ele.addClass('hg-select');
		ele.prepend(html);
		this.set(cfg.value);
		ele.on('change','select',function(){
			var v=$(this).val();
			_th.set(v);
		});
	}
	hg.inheritPrototype(ZSelect,ZEvent);
	ZSelect.prototype.set=function(val){
		var ele=$(this.cfg.element);
		var s=ele.find('select')
		if(!val){
			val=s.val();
		}
		s.val(val);
		var text=s.find('option:checked').html();
		ele.find('.hg-select-value').html(text);
		this.trigger({
			name:'change',
			value:val,
			element:$(this.cfg.element).find('select')
		});
	}

	$.fn.mkSelect = function(cfg) {
    	cfg.element=this;
    	return new ZSelect(cfg);
    };
})($);