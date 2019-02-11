$.fn.dropdown = function(opt){
	var sels = this;
	sels.each(function(i){
		var sel = $(this);
		var orgValue = sel.val();
		
		function fillSel(list,field,label){
			
			$.each(list,function(i,d){
				
				var oo = {};
				if($.isPlainObject(d)){
					if(!field){
						field = "value";
					}
					if(!label){
						label = "text";
					}
					oo.value = d[field];
					oo.text = d[label];
				}else{
					oo.value = d;
					oo.text = d;
				}
				if(oo.value==orgValue){
					oo.selected = "selected";
				}
				var option = $("<option>",oo);
				sel.append(option);
			});
			sel.data("list",list);
			bindOnChange();
		}
		
		sel.empty();
		if(opt.defaultOption){
			sel.append($("<option>",opt.defaultOption));
		}
		var dataset = opt.dataset;
		var valueField = dataset.field;
		
		if($.isArray(dataset)){
			fillSel(dataset);
		}else{
			var ajaxOption = $.extend({
				success:function(data){
					var arr = null;
					if(data.rows){
						arr = data.rows;
					}else{
						arr = data;
					}
					fillSel(arr,dataset.field,dataset.label);
				}
			},dataset);
			$.ajax(ajaxOption);
		}
		
		function bindOnChange(){
			sel.on("change",function(){
				var list = sel.data("list");
				var data=null;
				for(var i=0;i<list.length;i++){
					var item = list[i];
					if(item[valueField]==sel.val()){
						data = item;
						sel.data("data",data);
						break;
					}
				}
				if(opt.onChange){
					opt.onChange(data);
				}
			});
		}
	});
	
	
};