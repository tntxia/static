function BootstrapTabs(opt){
	
	var target = opt.target;
	
	var tabs = new Array();
	
	this.addTab = function(tab){
		tabs.push(tab);
	};
	
	this.init = function(){
		
		target.empty();
		
		var ul = $("<ul>",{
			'class':'nav nav-tabs'
		});
		target.append(ul);
		
		var div = $("<div>",{
			'class':'tab-content'
		});
		target.append(div);
		
		$.each(tabs,function(i,tab){
			var li = $("<li>");
			var tabpanel = $("<div>",{
				'class':'tab-pane'
			});
			if(i==0){
				li.addClass('active');
				tabpanel.addClass('active');
				tabpanel.load(tab.template,function(){
					var handler = tab.handler;
					if(handler){
						handler.call(this);
					}
				});
			}
			var anchor = $("<a>",{
				text:tab.label
			});
			li.append(anchor);
			
			li.click(function(){
				$(this).parent().find("li").removeClass("active");
				$(this).addClass("active");
				$(this).parent().parent().find(".tab-pane").hide();
				tabpanel.show();
				tabpanel.load(tab.template,function(){
					var handler = tab.handler;
					if(handler){
						handler.call(this);
					}
				});
			});
			ul.append(li);
			div.append(tabpanel);
			
			
		});
		
		
	};
	
}