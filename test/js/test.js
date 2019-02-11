$(function(){

	

	$("#datagrid").height($(window).height());

	let grid = new BootstrapGrid({
		target:$("#datagrid"),
		url:'json/menu.json',
		editable:true,
		cols:[{
			label:'序号',
			type:'index'
		},{
			label:'名称',
			field:'name',
			editable:true
		},{
			label:'URL',
			field:'url',
			editable:true
		},{
			label:'日期',
			renderer:function(){

				var div = $("<div>");
				let dateStartSel = $("<select>",{
					field: 'dateStart'
				});
				for(let i=1;i<=31;i++){
					let option = $("<option>",{
						text: i
					});
					dateStartSel.append(option);
				}
				div.append(dateStartSel);
				
				div.append("至");

				let dateEndSel = $("<select>",{
					field: 'dateEnd'
				});
				for(let i=1;i<=31;i++){
					let option = $("<option>",{
						text: i
					});
					dateEndSel.append(option);
				}
				div.append(dateEndSel);

				return div;
			}
		},
		{
			label:'test',
			renderer(){
				return "test"
			}
		}]
	});
	grid.init();

	$("#form").buildform({
		data:{
			"name":"test"
		},
		actions:{
			add:function(){
				grid.addRow();
			},
			save:function(){
				console.log(grid.getRows());
			}
		}
	})

	$(window).resize(function(){
		$("#datagrid").height($(window).height());
	})
	
})