$.fn.getParamMap = function(escapeFlag) {
	var res = {};
	
	// 对普通表单元素的处理
	this.find(":input").each(function(i, inp) {

		if (inp.name && inp.name != "") {

			var value;
			if (escapeFlag) {
				value = escape($.trim(inp.value));
			} else {
				value = inp.value;
			}
			
			// 如果是checkbox,不选择，则不赋值
			if(inp.type=="checkbox" || inp.type=="radio"){
				if(!$(inp).prop("checked")){
					return;
				}
			}
			

			if (res[inp.name]) {
				var orignValue = res[inp.name];
				if (typeof orignValue == "string") {
					var arr = [];
					arr.push(orignValue);
					arr.push(value);
					res[inp.name] = arr;
				} else {
					res[inp.name].push(value);
				}
			} else {
				res[inp.name] = value;
			}
		}
	});
	
	// 对富文本编辑组件的处理
	this.find("[jxiaui=rich-editor]").each(function(i,d){
		var name = $(this).attr("name");
		var iframe = $(this).find("iframe");
		var contentWindow = iframe.get(0).contentWindow;
		var body = contentWindow.document.body;
		res[name] = body.innerHTML;
	});
	
	return res;
};
