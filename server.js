var express = require('express'),
	path = require('path'),
	ejs = require('ejs'),
	util = require('util'),
	multiparty = require('multiparty'),
	fs = require('fs');

var app = module.exports = express();


app.set('views',path.join(__dirname,'res/module/'));
//ejs引擎默认使用.ejs文件作为模板，这里指定.html作为模板
//app.engine方法是指定某一后缀的文件使用何种方法处理
app.engine('.html',ejs.__express);
app.set('views engine','html');

app.all("/module/*",function(req,res){
	var url=req.url;
	res.render(url.replace('/module/',''));
});

app.post("/upload",function(req,res){
	var form = new multiparty.Form({uploadDir: 'res/test/upload/'});
	form.parse(req, function(err, fields, files) {
	    var filesTmp = JSON.stringify(files,null,2);
	    if(err){
	      console.log('parse error: ' + err);
	     } else {
	       var inputFile = files.Filedata[0];
	       var uploadedPath = inputFile.path;
	       var dstPath = 'res/test/upload/' + inputFile.originalFilename;
	       //重命名为真实文件名
	       fs.rename(uploadedPath, dstPath, function(err) {
	         if(err){
	           console.log('rename error: ' + err);
	         } else {
	           console.log('rename ok');
	         }
	       });
	     }
	 
	     res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
	     res.end('/test/upload/' + inputFile.originalFilename);
     });
});

app.use(express.static(path.join(__dirname,'res')));

app.listen('8080','192.168.155.1',function(){
	console.log('listen 192.168.155.1:8080');
});
app.listen('8080','localhost',function(){
	console.log('listen localhost:8080');
});



