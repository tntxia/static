
console.log(process.argv);

let currPath = process.cwd();

var fs= require("fs");

fs.readFile(currPath+'\\package.json',function(err,data){
    if(err){
        console.log("can't find package.json!!")
    }else{
    	writeToFile(JSON.parse(data));
    }
});

function writeToFile(data){
	
	var DomTree = require("./HTMLPage.js");
	
	var dom = new DomTree();
	var head = dom.append("head");
	var target = data.target;
	var title = data.title;
	let script = data.script;
	let stylesheet = data.stylesheet;
	
	var bodyFile = data.body;
	
	if(title){
		head.append({
			name:'title',
			text:title
		});
	}
	
	head.append({
		name:'meta',
		isSingle:true,
		attributes:{
			charset:'utf-8'
		}
	});

	stylesheet.map(item=>{
		head.append({
			name:'link',
			attributes:{
				rel:'stylesheet',
				type:'text/css',
				href:item.href
			}
		})
	});
	
	script.map(item=>{
		head.append({
			name:'script',
			attributes:{
				src:item.src
			}
		})
	});
	
	var body = dom.append("body");
	
	dom.generateFile({
		target:currPath+"\\"+target
	});
	
}

function $each(arr,callback){
	for(var i=0;i<arr.length;i++){
		var a = arr[i];
		callback(i,a);
	}
}


