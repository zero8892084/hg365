;(function($){
	var o=$('#J_confirm');

	ZConfirm=function(){
		ZEvent.call(this);
		var _th=this;
		o.on('touchend','.J_confirm_ok',function(){
			_th.trigger('ok');
			_th.hide();
		});
		o.on('touchend','.J_confirm_cancel',function(){
			_th.trigger('cancel');
			_th.hide();
		});
	}
	hg.inheritPrototype(ZConfirm,ZEvent);
	ZConfirm.prototype.show=function(cfg){
		/*cfg:
			{
				title:"",
				html:"",
				ok:{
					text:"",
					callback:function(){}
				},
				cancel:{
					text:"",
					callback:function(){}
				}
			}
		*/
		var _th=this;
		cfg=cfg?cfg:{};
		o.find('.hg-title').html(cfg.title||'请确认');
		o.find('.J_confirm_content').html(cfg.html);
		o.find('.J_confirm_cancel').html((cfg.cancel&&cfg.cancel.text)||'取消');
		o.find('.J_confirm_ok').html((cfg.ok&&cfg.ok.text)||'确认');
		var h=o.height();
		o.css({
			'margin-top':'-'+(h/2)+'px'
		});
        o.removeClass('fn-hide')
         .removeClass('hg-dialog-up')
         .addClass('hg-dialog-down');
        
        if(cfg.ok&&cfg.ok.callback){
        	this.on('ok',cfg.ok.callback);
        }
        if(cfg.cancel&&cfg.cancel.callback){
        	this.on('ok',cfg.cancel.callback);
        }
	}
	ZConfirm.prototype.hide=function(){
		o.removeClass('hg-dialog-down')
             .addClass('hg-dialog-up');
        setTimeout(function(){
            o.addClass('fn-hide');
        },250);
	}
})($);