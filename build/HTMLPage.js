
module.exports = HTMLPage;

function HTMLPage(){
	
	var doctype = new Element({
		name:"!DOCTYPE",
		isSingle:true,
		attributes:{
			"HTML":null
		}
	});
	
	var root = new Element("html");
	var html="";
	this.append = function(el){
		return root.append(el);
	}
	
	this.generateFile = function(opt){
		
		var fs= require("fs");
		
		var target = opt.target;
		
		html = "";
		
		generateHTML(doctype);
		generateHTML(root);
		
		fs.writeFile(target,html,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
			if(err){
				console.log("can't generate html file!!");
			}else{
				console.log("build finish!!");
			}
		});
		
	}
	
	function generateHTML(ele){
		
		html += "<"+ele.name;
		
		if(ele.attributes){
			var attr = ele.attributes;
			for(var a in attr){
				
				html += " "+a;
				if(attr[a]!=null){
					html+= "='"+attr[a]+"'"
				}
				
			}
		}
		
		html += ">";
		
		// 如果不是Single，要判断是否标签里面是有内容，或者有子结点
		if(!ele.isSingle){
			if(ele.children && ele.children.length){
				html += "\n";
				for(var i=0;i<ele.children.length;i++){
					var c = ele.children[i];
					generateHTML(c);
				}
			}else{
				if(ele.text){
					html += ele.text;
				}
			}
			html += "</"+ele.name+">\n";
		}else{
			html += "\n";
		}
		
	}
	
	function Element(opt){
		
		this.children = new Array();
		var text;
		if(typeof opt=="string"){
			this.name = opt;
		}else{
			this.name = opt.name;
			this.text = opt.text;
			this.attributes = opt.attributes;
			this.isSingle = opt.isSingle;
		}
		this.append = function(el){
			var element = new Element(el);
			this.children.push(element);
			return element;
		}
		
	}
}
