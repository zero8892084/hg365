;(function(){
      var baseUrl="";
      var dataArray = {
            productInfo:{//产品详细页-产品详细
                  static:"../../data/product/productInfo.json",
                  remote:baseUrl+""
            },
            inv:{//产品详细页-获取库存
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
            },
            shopCar:{//购物车-获取购物车列表
                  static:"../../data/user/shopCar.json",
                  remote:baseUrl+""
            },
            shopCarInvalid:{//购物车-验证购物车中的项是否失效
                  static:"../../data/user/isInvalid.json",
                  remote:baseUrl+""
            },
            settlement:{//结算页-获取运费，并根据运费排列商品
                  static:"../../data/user/settlement.json",
                  remote:baseUrl+""
            },
            address:{//地址管理-获取地址列表
                  static:"../../data/user/address.json",
                  remote:baseUrl+""
            },
            province:{//地址管理-获取省級列表
                  static:"../../data/user/province.json",
                  remote:baseUrl+""
            },
            saveAddress:{//地址管理-保存地址
                  static:"../../data/user/province.json",
                  remote:baseUrl+""
            },
            prodetToShopcar:{//产品详细页-添加到购物车
                  static:"../../data/user/province.json",
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
            "chooseAddress":{//已选择的地址
                  key:'chooseAddress'
            },
            "editAddress":{//需要修改的地址
                  key:'editAddress'
            }
      }
      window.cacheCfg=cache;
})();

