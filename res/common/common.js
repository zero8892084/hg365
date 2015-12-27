;(function($){
    /*
        handlebars扩展
        eg:
        $('#content').temp( $('#template'),  { name: "Alan" } );
        $('#content').temp( 'string' ,  { name: "Alan" } );
    */
    var compiled = {};
    $.fn.temp = function(template, data ,flag) {
        /*
        if( $.zepto.isZ(template) ){
            template = template.val();
        }
        */
        if(template instanceof jQuery){
            template = template.val();
        }
        compiled[template] = Handlebars.compile(template);
        if(flag){
            this.append(compiled[template](data));
        }else{
            this.html(compiled[template](data));
            //console.log(compiled[template](data))
        }
        return this;
    };

    /**
     * If Greater Than
     * if_gt this compare=that
     */
    Handlebars.registerHelper('if_gt', function(context, options) {
      if (context > options.hash.compare)
        return options.fn(this);
      return options.inverse(this);
    });
    Handlebars.registerHelper('jts', function(value){
        return JSON.stringify(value);
    });
    Handlebars.registerHelper('indexAddOne', function(index){
        return index+1;
    });
    Handlebars.registerHelper('isOdd', function(index){
        if(index%2==1){
            return 'odd';
        }else{
            return '';
        }
    });
    Handlebars.registerHelper('toMinute', function(sec){
        var h=sec/60;
        var s=sec%60;
        return parseInt(h)+':'+s;
    });
    Handlebars.registerHelper('divide100', function(value){
        return value/100;
    });


    //工具方法
    var hg = {}
    //获取html方法
    hg.getHtml=function(cfg) {
        var url= ((typeof cfg == 'object') ? cfg.url : cfg),
            datas=cfg.data, 
            callback=cfg.callback;
        var dtd = $.Deferred();
        $.ajax({
            url: url + "?random=" + new Date().getTime(),
            type: "GET",
            data : datas ,
            cache: false,
            dataType: "html",
            success: function(html) {
                if(callback && typeof callback == 'function'){
                    callback("success", html);
                }
                dtd.resolve(html);
            },
            error: function() {
                if(callback && typeof callback == 'function'){
                    callback("error", null);
                }
                dtd.reject();
            }
        });
        return dtd.promise();
    }
    //获取远程数据方法，无缓存
    hg.getJson=function(cfg) {
        var url=((typeof cfg == 'object') ? cfg.url : cfg),
            datas=cfg.data||'', 
            callback=cfg.callback,
            method = cfg.type || 'GET' ;
        var dtd = $.Deferred();
        if(typeof datas == 'object'){
            datas['_']=(new Date()).getTime();
        }else{
            datas+='&_='+(new Date()).getTime();
        }
        $.ajax({
            url: url,
            type: method,
            data : datas ,
            cache: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=utf-8");
                //xhr.setRequestHeader("x-requested-with","XMLHttpRequest");
            }
        }).done(function(json){
            var buState='error';
            if(json&&json.code=='0'){
                buState='success';
                dtd.resolve(json);
            }else if(json&&json.code=='302'){
                //会话超时
                dtd.reject(json);
            }else{
                //数据返回错误
                dtd.reject(json);
            }
            if(callback && typeof callback == 'function'){
                callback(state,json)    
            }
        }).fail(function(){
            if(callback && typeof callback == 'function'){
                callback( "error", {"message":"服务器连接出错!"} );
            }
            dtd.reject({"message":"服务器连接出错!"});
        }).always(function(){

        });
        return dtd.promise();
    }
    hg.jsonp=function(cfg){
        var url=((typeof cfg == 'object') ? cfg.url : cfg),
            datas=cfg.data||'', 
            callback=cfg.callback;
        var dtd = $.Deferred();
        $.ajax({
            url: url,
            data : datas ,
            dataType: "jsonp",
            jsonp: 'jsonpCallback',
            timeout: 5000
        }).done(function(json){
            dtd.resolve(json);
            if(callback && typeof callback == 'function'){
                callback( "success", json );
            }
        }).fail(function(){
            dtd.reject({"message":"服务器连接出错!"});
            if(callback && typeof callback == 'function'){
                callback( "error", {"message":"服务器连接出错!"} );
            }
        });
        return dtd.promise();
    }
    //url处理方法
    hg.url={
        getUrl:function(){
            return window.location.href;
        },
        /*
         * 获取url参数，多个参数
         * //Get object of URL parameters
         * var allVars = $.getUrlVars();
         * //Getting URL var by its name
         * var getName = $.getUrlVar('name');
         */
        getUrlVars: function(strUrl){
            var vars = [], hash;
            var url=strUrl||window.location.href;
            var hashes = url.slice(url.indexOf('?') + 1).split('&');

            for(var i = 0; i < hashes.length; i++)
            {
              hash = hashes[i].split('=');
              vars.push(hash[0]);
              vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlVar: function(name,strUrl){
            return hg.url.getUrlVars(strUrl)[name];
        }
    }
    //时间处理方法
    hg.time={
        strToDate:function(dateStr,formatStr){
            //YYYY是年
            //MM是“01”月的格式
            //DD是“01”日的格式
            //HH是小时、MN是分、SS是秒
            var digit=0;//退位计数器
            var date=new Date();
            var newFormat=formatStr.toUpperCase();
            var year=getNumFromStr(dateStr,newFormat,'YYYY');
            var month=getNumFromStr(dateStr,newFormat,'MM');
            var da=getNumFromStr(dateStr,newFormat,'DD');
            var hour=getNumFromStr(dateStr,newFormat,'HH');
            var mn=getNumFromStr(dateStr,newFormat,'MN');
            var ss=getNumFromStr(dateStr,newFormat,'SS');
            if (year > 0)
                date.setFullYear(year);
            if (month > 0)
                date.setMonth(month - 1);
            if (da > 0)
                date.setDate(da);
            if (hour > 0)
                date.setHours(hour);
            if (mn > 0)
                date.setMinutes(mn);
            if (ss > 0)
                date.setSeconds(ss);
            return date;
            function getNumFromStr(target,frm,s){
                //target是目标字符串，frm是模板字符串，s是匹配字符
                var len=s.length;
                var index=frm.indexOf(s);
                if(index<0)return index;
                var reStr=target.substr(index-digit,len);
                var result=parseInt(reStr,10);//(s=='SM'||s=='SD')&&
                if(result<10&&(reStr.charAt(0)!=0)){
                    digit++;
                }
                return result;
            }
        },
        dateToStr:function(date , formatStr){ 
            var str = formatStr; 
            str=str.replace(/yyyy|YYYY/,date.getFullYear()); 
            str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():"0" + (date.getYear() % 100)); 
            str=str.replace(/MM/,date.getMonth()>8?(date.getMonth()+1).toString():"0" + (date.getMonth()+1)); 
            str=str.replace(/M/g,date.getMonth()+1); 
            str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():"0" + date.getDate()); 
            str=str.replace(/d|D/g,date.getDate()); 
            str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():"0" + date.getHours()); 
            str=str.replace(/h|H/g,date.getHours()); 
            str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():"0" + date.getMinutes()); 
            str=str.replace(/m/g,date.getMinutes()); 
            str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():"0" + date.getSeconds()); 
            str=str.replace(/s|S/g,date.getSeconds()); 
            return str; 
        },
        getMonthLastDay:function(timeStr,formatStr){
            var date=this.strToDate(timeStr,formatStr);
            date.setMonth(date.getMonth()+1);
            date.setDate(0);
            var day=date.getDate()+'';
            return day.length<2?('0'+day):day;
        }
    }
    //本地缓存
    hg.cache = new ZCache({
        cache:cacheCfg,
        remote:{
            func:function(args,tools){
                hg.getJson({
                    url:tools.getUrl(),
                    data:args[1].data,
                    type:args[1].type||'GET',
                }).done(function(json){
                    tools.success(args,json);
                }).fail(function(json){
                    tools.error(args,json);
                });
            },
            success:function(args,json){
                var cb=args[1].callback;
                if(cb){
                   cb('success',json);
                }
            },
            error:function(args,json){
                var cb=args[1].callback;
                if(cb){
                   cb('error',json);
                }
            }
        }
    });
    /*本对象暂时不支持checkbox和radio的值获取*/
    hg.form=function(ele,hock){
        if(!hock){
            var objs=$(ele).find('input,select,textarea');
        }else{
            var objs=$(ele).find(hock);
        }
        return {
            val:function(data){
                if(!data){
                    var result={};
                    objs.each(function(){
                        var tg=this.tagName;
                        var th=$(this);
                        var key=th.attr('name');
                        if(tg=='INPUT'||tg=='SELECT'||tg=='TEXTAREA'){
                            var val=th.val();
                        }else{
                            var val=th.html();
                        }
                        if(key){
                            result[key]=val;
                        }
                    });
                    return result;
                }else{
                    objs.each(function(){
                        var tg=this.tagName;
                        var th=$(this);
                        var key=th.attr('name');
                        if(!key){return;}
                        var val=data[key];
                        if(tg=='INPUT'||tg=='SELECT'||tg=='TEXTAREA'){
                            th.val(val);
                        }else{
                            th.html(val);
                        }
                    });
                    return this;
                }
            },
            valStr:function(){
                var result=this.val();
                var str='';
                for(var i in result){
                    str+='&'+i+'='+result[i];
                }
                return str;
            }
        }
    }

    /*
     * 通用正则表达式
     * floatNum匹配可精确到小数点后两位或者整数
     */
    hg.regExp={
        "cellphone":new RegExp('^(1[0-9]{10})$','g'),
        "number":new RegExp('^(\\d+$)','g'),
        "floatNum":new RegExp('^\\d+(\\.\\d{1,2})?$','g'),
        "Chinese":/[\u4E00-\u9FFF]/g
    }
    hg.event=new ZEvent();
    hg.event.SCROLL_BOTTOM='scroll_bottom';

    hg.data=function(cfg){
        if(cfg && typeof cfg == 'object' &&cfg.cache){
            var dtd = $.Deferred();
            var c={};
            c[cfg.cache.name]={
                key:cfg.cache.name,
                url:cfg.url,
                maxAge:cfg.cache.maxAge,
                count:cfg.cache.count
            }
            hg.cache.addCache(c);
            hg.cache.get(cfg.cache.name,{
                data:cfg.data,
                callback:function(state,json){
                    if(cfg.callback&&typeof cfg.callback == 'function'){
                        cfg.callback(state,json);
                    }
                    if(state=="success"){
                        dtd.resolve(json);
                    }else{
                        dtd.reject(json);
                    }
                }
            });
            return dtd.promise();
        }else{
            return hg.getJson(cfg);
        }
    };

    hg.alert=function(message,time){
        var al=$('#J_alert');
        al.html(message);
        al.removeClass('fn-hide')
          .removeClass('hg-dialog-up')
          .addClass('hg-dialog-down');
        time=time||2500;
        setTimeout(function(){
            al.removeClass('hg-dialog-down')
              .addClass('hg-dialog-up');
            setTimeout(function(){
                al.addClass('fn-hide');
            },250);
        },time);
    }
    hg.object=function(obj){
        function A(){}
        A.prototype = obj;
        var o = new A();
        return o;
    }
    hg.inheritPrototype=function(Sub,Super){
        var prototype = hg.object(Super.prototype);//创建对象  
        prototype.constructor = Sub;//增强对象  
        Sub.prototype = prototype;//自定对象
    }

    //去掉字符串头尾空格
    String.prototype.trim = function()
    {
        return this.replace(/(^\s*)|(\s*$)/g,"");
    }

    window.hg=hg;
})(jQuery);

/*滚动监听封装*/
;(function($,window){
    function ScrollControl(){
        this.register=[];
        var _th=this;
        var w=$(window);
        var d=$(document);
        var bottomOffset=20;
        var pointerOffset=50;
        var last=0;
        w.on('scroll',function(){
            var top=w.scrollTop();
            //isDown是true的时候，说明向下滑动，isDown为false时，向下滑动
            var isDown=(top-last)>0;
            last=top;
            var vwHeight=w.height();
            var dcHeight=d.height();
            //触发到达底部事件
            if(top+vwHeight+bottomOffset>dcHeight){
                hg.event.trigger(hg.event.SCROLL_BOTTOM);
            }
            //判断是否触发注册的点的事件
            for(var i = 0; i<_th.register.length;i++){
                var o=_th.register[i];
                if(top+pointerOffset<o.offset&&top+vwHeight-pointerOffset>o.offset){
                    hg.event.trigger(o.name,{
                        direction:isDown
                    });
                }
            }
        });
    }

    ScrollControl.prototype.regist=function(obj,eventName){
        var offset=$(obj).offset().top;
        var index=this.register.length;
        for(var i=0 ;i<this.register.length; i++){
            var o = this.register[i];
            if(o.offset>offset){
                index=i;
                break;
            }
        }
        this.register.splice(index,0,{offset:offset,name:eventName,ele:obj});
        return this;
    }
    window.ScrollControl=ScrollControl;


    hg.scrollCtr=new ScrollControl();
})(jQuery,window);

/*发送短信*/
;(function($){
    function SendMessage(cfg){
        /*
            cfg:{
                ele:"",
                url:"",
                data:function 获取,
                sec:"重发等待秒数"
            }
        */
        this.cfg=cfg;
        $(cfg.ele).on('touchend',function(){
            var _th=$(this);
            if(_th.hasClass('hg-btn-disabled')){
                return; 
            }
            var str=cfg.data&&cfg.data();
            if(!str||!str.match(hg.regExp.cellphone)){
                hg.alert('请输入手机号码'); 
                return;
            }
            _th.addClass('hg-btn-disabled').addClass('shortcut-dis').html('发送中...');
            hg.data({
                url:cfg.url,
                data:'phone='+str
            }).done(function(){
                _th.html(cfg.sec+"秒后重新获取");
                var sec=cfg.sec;
                ;(function(){
                    setTimeout(function(){
                        if(sec>0){
                            sec--;
                            _th.html(sec+"秒后重新获取");
                            setTimeout(arguments.callee,1000);
                        }else{
                            _th.html('<span class="hg-iconfont hg-iconfont-send"></span>发送验证码').removeClass('shortcut-dis').removeClass('hg-btn-disabled');
                        }
                    },1000);
                })();
            }).fail(function(){
                _th.html('<span class="hg-iconfont hg-iconfont-send"></span>发送验证码').removeClass('hg-btn-disabled');
            });
        });
    }
    $.fn.makeSendMessage=function(cfg){
        cfg.ele=this;
        new SendMessage(cfg);
        return this;
    }
})($);

//定义confirm
$(function(){
    var zconfirm=new ZConfirm();
    hg.confirm=function(cfg){
        zconfirm.show(cfg);
    }
});



