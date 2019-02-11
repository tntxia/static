(function(globe,name,fun){
	globe[name] = fun();
})(window,"BootstrapUtils",function(){

	return {
		createDialog : function(opt){
			
			var id = opt.id;
			
			var dialogDiv;
			
			// 初始化函数
			var initFun = opt.init;
			
			var width = opt.width;

			var showDefaultButton = true;
			if(opt.showDefaultButton===false){
				showDefaultButton = false;
			}
			
			$("#"+id).remove();
			
			dialogDiv = buildDialogDiv(opt,function(){
				if(initFun)
					initFun.call(this);
			});
			
			return dialogDiv;
			
			function buildDialogDiv(opt,callback){
				var template = opt.template;
				var onFinish = opt.onFinish;
				var title = opt.title;
				
				var onConfirm = opt.onConfirm;
				
				var divDialogOutside = $("<div>",{
					'class':"modal fade",
					tabindex:'-1',
					role:'dialog',
					id:id
				});
				
				var divDocument = $("<div>",{
					'class':"modal-dialog",
					role:"document"
				});
				if(width){
					divDocument.width(width);
				}
				
				var divContent = $("<div>",{
					'class':"modal-content"
				});
				
				divDocument.append(divContent);
				
				var divHeader = $("<div>",{
					'class':"modal-header"
				});
				
				var button =$("<button>",{
					'type':'button',
					'class':'close',
					'data-dismiss':'modal',
					'aria-label':'Close'
				});
				
				var spanClose = $("<span>",{
					"aria-hidden":"true",
					html:'&times;'
				});
				
				button.append(spanClose);
				
				divHeader.append(button);
				
				var titleH = $("<h4>",{
					"class":"modal-title",
					text:title
				});
				
				divHeader.append(titleH);
				
				var divBody = $("<div>",{
					'class':'modal-body'
				});
				
				divContent.append(divHeader);
				
				divContent.append(divBody);
				
				var divFooter = $("<div>",{
					'class':"modal-footer"
				});

				if(showDefaultButton){
					var closeBtn = $("<button>",{
						'class':'btn btn-default',
						"data-dismiss":"modal",
						text:"关闭"
					});
					
					var confirmBtn = $("<button>",{
						'class':'btn btn-default',
						text:"确定"
					});
					
					confirmBtn.click(function(){
						if(onConfirm){
							onConfirm.call(divDialogOutside);
						}
					});
					
					divFooter.append(confirmBtn);
					divFooter.append(closeBtn);
				}
				
				divContent.append(divFooter);
				
				divDialogOutside.append(divDocument);
				
				$("body").append(divDialogOutside);
				
				if(template){
					divBody.load(template,function(){
						if(onFinish){
							onFinish.call(divDialogOutside);
						}
						if(callback){
							callback.call(divDialogOutside);
						}
					});
				}else if(opt.templateStr){
					divBody.append(opt.templateStr);
					if(onFinish)
						onFinish.call(divDialogOutside);
				}
				
				return divDialogOutside;
			}
			
		},
		createGrid:function(opt){
			
			var cols = opt.cols;
			var target = opt.target;
			var url = opt.url;
			var paramMap = opt.paramMap;
			
			var check = opt.check;
			
			if(!paramMap){
				paramMap = {};
			}
			
			target.empty();
			
			var table = $("<table>",{
				'class':'table table-bordered table-hover table-condensed'
			});
			target.append(table);
			
			var thead = $("<thead>");
			table.append(thead);
			
			var tr = $("<tr>");
			thead.append(tr);
			
			if(check){
				var checkbox = $("<input>",{
					type:'checkbox'
				});
				
				checkbox.click(function(){
					
					$(this).closest("table").find(":checkbox").prop("checked",$(this).prop("checked"));
					
				})
				
				var td = $("<td>");
				td.append(checkbox);
				tr.append(td);
			}
			
			$.each(cols,function(i,c){
				var td = $("<td>",{
					text:c.label
				});
				tr.append(td);
			});
			
			var tbody = $("<tbody>");

			
			table.append(tbody);
			
			var nav = $("<nav>");
			nav.height(40);
			target.append(nav);
			
			var ul = $("<ul>",{
				'class':"pagination",
			});
			ul.css("float","left");
			
			nav.append(ul);
			
			var span = $("<span>");
			span.css({
				"float":"left",
				"line-height":"33px"
			});
			nav.append(span);
			
			var jumpSpanArea = $("<span>",{
				'class':"jumpSpanArea"
			});
			
			var jumpSpan = $("<span>",{
				text:'跳转到第'
			});
			var inputJump = $("<input>",{
				type:'number',
				size:4
			});
			inputJump.css({
				height:20,
				width:50
			});
			jumpSpan.append(inputJump);
			jumpSpan.css({
				"float":"left",
				"line-height":"33px"
			});
			jumpSpan.append("页");
			jumpSpanArea.append(jumpSpan);
			
			
			var jumpBtn = $("<button>",{
				text:'跳转',
				click:function(){
					var pageNo = inputJump.val();
					fetchData(pageNo);
				}
			});
			jumpSpanArea.append(jumpBtn);
			
			nav.append(jumpSpanArea);
			
			fetchData();
			
			/**
			 * 处理请求返回的数据
			 */
			function handleData(data){
				
				var pageNo;
				var totalPage;

				var rows;
				var pageNavFlag = false;
				if(data.length){
					rows = data;
				}else{
					pageNo = data.page;
					rows = data.rows;
					totalPage = data.totalPage;
					pageNavFlag = true;
				}
				
				inputJump.val(parseInt(pageNo)+1);
				
				tbody.empty();
				
				ul.empty();
				
				if(pageNavFlag){
					
					if(totalPage>1){
						jumpSpanArea.show();
						var nearPageNoArr = [];
						for(var i=pageNo-2;i<pageNo;i++){
							if(i>0){
								nearPageNoArr.push(i);
							}
						}
						nearPageNoArr.push(pageNo);
						for(var i=pageNo+1;i<=totalPage;i++){
							if(nearPageNoArr.length>=5){
								break;
							}
						}
						
						var lastPageNoArr = new Array();
						for(var i=totalPage-2;i<=totalPage;i++){
							if(i>0){
								lastPageNoArr.push(i);
							}
							
						}
						
						for(var i=0;i<nearPageNoArr.length;i++){
							
							var p = nearPageNoArr[i];
							var li = $("<li>",{
								
							});
							if(p==pageNo){
								li.addClass("active");
							}
							var a = $("<a>",{
								text:p
							});
							a.click(function(){
								var pageNo = $(this).text();
								fetchData(pageNo);
							})
							li.append(a);
							ul.append(li);
						}
						
						var lastNearPageNo = nearPageNoArr[nearPageNoArr.length-1];
						
						if(lastPageNoArr.length==3 && (lastNearPageNo+1)<lastPageNoArr[0]){
							ul.append("<li><a>...</a></li>");
						}
						
						for(var i=0;i<lastPageNoArr.length;i++){
							var p = lastPageNoArr[i];
							if(p>lastNearPageNo){
								var p = lastPageNoArr[i];
								var li = $("<li>",{
									
								});
								if(p==pageNo){
									li.addClass("active");
								}
								var a = $("<a>",{
									text:p
								});
								a.click(function(){
									var pageNo = $(this).text();
									fetchData(pageNo);
								})
								li.append(a);
								ul.append(li);
							}
						}
					}else{
						jumpSpanArea.hide();
					}
				}
					
				$.each(rows,function(i,r){
					tr = $("<tr>");
					
					if(check){
						var checkbox = $("<input>",{
							type:'checkbox'
						});
						
						var td = $("<td>");
						td.append(checkbox);
						tr.append(td);
					}
					
					$.each(cols,function(j,c){
						
						var text;
						if(c.type=='index'){
							text = i+1;
						}else{
							text = r[c.field];
						}
						
						var html;
						if(c.renderer)
							html = c.renderer(r);
						else
							html = text;
						var td = $("<td>",{
							html:html
						});
						tr.append(td);
					});
					tbody.append(tr);
				});
				
				span.empty();
				if(pageNavFlag){
					span.append("每页"+data.pageSize+"条 当前第"+data.page+"页，总共"+data.totalPage+"页 总条数："+data.totalAmount+" ;");
				}
				
				
			}
			
			function fetchData(pageNo){
				
				if(!pageNo){
					pageNo = 1;
				}
				
				paramMap.page = pageNo;
				
				$.ajax({
					url:url,
					type:'post',
					data:paramMap
				}).done(function(data){
					
					handleData(data);
					
					
				}).fail(function(e){
					console.error(e);
				});
			}
			
			
			
			
		}
	};
	
});