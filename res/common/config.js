;(function(){
      var baseUrl="";
      var dataArray = {
            productInfo:{//产品详细
                  static:"../../data/product/productInfo.json",
                  remote:baseUrl+""
            },
            inv:{//获取库存
                  static:"../../data/product/inventory.json",
                  remote:baseUrl+""
            },
            sendMessage:{//发送短信
                  static:"../../data/login/sendMessage.json",
                  remote:baseUrl+""
            },
            shortcut:{//快捷登录
                  static:"../../data/login/sendMessage.json",
                  remote:baseUrl+""
            },
            login:{//密码登录
                  static:"../../data/login/sendMessage.json",
                  remote:baseUrl+""
            },
            regist:{//注册
                  static:"../../data/login/sendMessage.json",
                  remote:baseUrl+""
            },
            repwd:{//重置密码
                  static:"../../data/login/sendMessage.json",
                  remote:baseUrl+""
            }
      }
      
      
      function Config(type){
            this.type=type||REMOTE;
      }

      Config.prototype.get = function(name,type) {
            var dataCfg=dataArray[name];
            type = (type==0)?type:this.type;
            if(!dataCfg) return '';
            if(type==REMOTE){
                  return dataCfg.remote;
            }else if(type==STATIC){
                  return dataCfg.static;
            }
      };
      
      var STATIC=1,
          REMOTE=0;
      //默认获取静态数据
      window.cfg=new Config(STATIC);
      //默认获取远端数据
      //window.cfg=new Config(REMOTE);
      



      var cache={
            /*"login":{
                  url:cfg.get('login'),
                  key:'login',
                  maxAge:60*1000,//缓存时长,毫秒,默认为0，为0的时候表示无限长
                  count:0//缓存读取次数
            }*/
            "record":{//播放记录
                  key:'record'
            }
      }
      window.cacheCfg=cache;
})();

