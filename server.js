// �½�server������  
var http = require('http');  
  
var hostname = '127.0.0.1';  
var port = 3000;  
  
var server = http.createServer(function(req, res) { 

	try{
		// res.writeHead(200, {'Content-Type': 'text/html'});    
		// res.writeHead(200, {'Content-Type': 'text/plain'});    
		res.statusCode = 200;  
		res.setHeader('Content-Type', 'text/html');  
		// res.getHeader('content-type')  
		// res.charset = 'utf-8';   ����

		var fs = require("fs");
		
		var content = fs.readFileSync(__dirname+"/"+req.url,"utf-8");
		res.write(content);
	  
		// �в���=�ȵ��� res.write(data, encoding) ֮���ٵ��� res.end().  
		res.end();
	}catch(e){
		console.error(e);
	}
    
});  
  
server.listen(port, hostname, function() {  
    // hostname��const����ʱ������������д��  
    //console.log('Server running at http://${hostname}:${port}/');  
  
    console.log('Server running at http://%s:%s', hostname, port);  
    // console.log('Server running at http://' + hostname + ':' + port + '/');  
}); 