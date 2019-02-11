

function BootstrapGrid(opt) {

    var cols = opt.cols;
    var target = opt.target;
    var url = opt.url;
    var paramMap = opt.paramMap;
    var editable = opt.editable;

    if (!paramMap) {
        paramMap = {};
    }

    let container;

    var check = opt.check;
    var tbody = $("<tbody>");
    var inputJump;

    var pageInfoSpan = $("<span>");

    var pageNo = 1;

    var pageSize = 20;

    var rows;

    var nav = $("<nav>");

    let tableContainer;

    let loadingSpan;

    let onFinish = opt.onFinish;

    this.setPageNo = function(p) {
        pageNo = p;
    }

    this.getRows = function() {
        return rows;
    }

    this.getRowsChecked = function() {

        if (!rows) {
            return rows;
        }

        var res = new Array();
        $.each(rows, function(i, r) {
            if (r.checked) {
                res.push(r);
            }
        });
        return res;

    }

    this.init = function() {

        target.empty();
        container = $("<div>", {
            "class": "bootstrap-grid-container"
        });
        target.append(container);

        tableContainer = $("<div>", {
            'class': "table-container"
        });

        container.append(tableContainer);

        if(url){
            loadingSpan = $("<span>", {
                'class': 'loadingSpan',
                text: '加载中。。。'
            });
        }
        
        tableContainer.append(loadingSpan);

        var table = $("<table>", {
            'class': 'table table-bordered table-hover table-condensed'
        });
        tableContainer.append(table);

        var thead = $("<thead>");
        table.append(thead);

        var tr = $("<tr>");
        thead.append(tr);

        if (check) {

            var checkbox = $("<input>", {
                type: 'checkbox'
            });

            checkbox.click(function() {
                var checked = $(this).prop("checked");
                $(this).closest("table").find(":checkbox").prop("checked", checked);
                $.each(rows, function(i, r) {
                    r.checked = checked;
                });
            })

            var td = $("<td>");
            td.append(checkbox);
            tr.append(td);
        }

        $.each(cols, function(i, c) {
            var td = $("<td>", {
                text: c.label
            });
            tr.append(td);
        });

        table.append(tbody);
        nav.height(40);
        container.append(nav);
        if(url){
            fetchData();
        }
        


    };

    this.load = function(params) {
        fetchData(params);
    }

    this.addRow = function(data){
        if(!data){
            data = {};
        }
        if(!rows){
            rows = new Array();
        }
        rows.push(data);
        
        addRowToTable(data,rows.length-1,editable);
    }

    function buildNavigation(totalPage, totalAmount) {

        nav.empty();
        let ul = $("<ul>", {
            'class': "pagination",
        });
        ul.css("float", "left");
        nav.append(ul);

        var jumpSpanArea = $("<span>", {
            'class': "jumpSpanArea"
        });

        pageNo = parseInt(pageNo);

        var pageNoArr = pagingNavArr(totalPage, pageNo);

        function pagingNavArr(totalPage, page) {
            var res = new Array();
            for (let i = 1; i <= totalPage; i++) {

                if (res.length == 10) {
                    if (i > page + 5) {
                        break;
                    }
                    res.splice(0, 1);
                }
                res.push(i);
            }
            return res;
        }

        for (var i = 0; i < pageNoArr.length; i++) {

            var p = pageNoArr[i];
            var li = $("<li>", {

            });
            if (p == pageNo) {
                li.addClass("active");
            }
            var a = $("<a>", {
                text: p
            });
            a.click(function() {

                pageNo = $(this).text();
                fetchData();
            })
            li.append(a);
            ul.append(li);
        }

        pageInfoSpan.css({
            "float": "left",
            "line-height": "33px"
        });
        jumpSpanArea.append(pageInfoSpan);

        var jumpSpan = $("<span>", {
            text: '跳转到第'
        });
        inputJump = $("<input>", {
            type: 'number',
            size: 4
        });
        inputJump.css({
            height: 20,
            width: 50
        });
        jumpSpan.append(inputJump);
        jumpSpan.css({
            "float": "left",
            "line-height": "33px"
        });
        jumpSpan.append("页");
        jumpSpanArea.append(jumpSpan);
        inputJump.val(parseInt(pageNo) + 1);

        nav.append(jumpSpanArea);

        var jumpBtn = $("<button>", {
            text: '跳转',
            click: function() {
                debugger;
                pageNo = inputJump.val();
                fetchData();
            }
        });
        jumpSpanArea.append(jumpBtn);

        pageInfoSpan.empty();
        pageInfoSpan.append("每页");
        var selectPageSize = $("<select>");

        var existFlag = false;
        var pageSizeArr = [5, 20, 50, 100, 200];
        $.each(pageSizeArr, function(i, p) {
            var option = $("<option>", {
                text: p,
                value: p
            });
            if (p == pageSize) {
                option.prop("selected", true);
            }
            selectPageSize.append(option);
        });
        selectPageSize.change(function() {
            pageSize = parseInt($(this).val());
            reload();
        });
        pageInfoSpan.append(selectPageSize);
        pageInfoSpan.append("条 当前第" + pageNo + "页，总共" + totalPage + "页 总条数：" + totalAmount + " ;");

    }

    function handleData(data) {

        var totalPage;
        var totalAmount;
        if (data.rows) {
            rows = data.rows;
            pageNo = data.page;
            totalPage = data.totalPage;
            totalAmount = data.totalAmount;
            nav.show();
        } else {
            rows = data;
            nav.hide();
        }
        tbody.empty();

        $.each(rows, function(i, r) {
            addRowToTable(r,i);
        });

        buildNavigation(totalPage, totalAmount);

    }

    function addRowToTable(r,i,editable){

        if(!r){
            r = {};
        }

        tr = $("<tr>");

        if (check) {
            var checkbox = $("<input>", {
                type: 'checkbox'
            });
            checkbox.data("rowIndex", i);
            checkbox.change(function() {
                var rowIndex = checkbox.data("rowIndex");
                rows[rowIndex].checked = $(this).prop("checked");
            });
            var td = $("<td>");
            td.append(checkbox);
            tr.append(td);
        }

        $.each(cols, function(j, c) {

            let field = c.field;

            let cellContent;

            if (c.type == 'index') {
                cellContent = i+1;
            } else {
                var value = r[field];
                if (c.renderer) {
                    let renderRes = c.renderer(value, r, field);
                    if ($.isArray(renderRes)) {
                        cellContent = [];
                        $.each(renderRes, function(i, d) {
                            var jq = $(d);
                            cellContent.push(jq);
                            jq.find(":input").each(function(i,d){
                                let input = $(d);
                                bindField(input,r);
                            });
                        });
                    }else{
                        
                        if (typeof renderRes === "string" && !(renderRes.charAt(0) === "<" && renderRes.charAt( renderRes.length - 1 ) === ">" && renderRes.length >= 3) ) {
                            cellContent = renderRes;
                        } else if(typeof renderRes === "number" ) {
                            cellContent = renderRes+"";
                        }else{
                            cellContent = $(renderRes);
                            cellContent.find(":input").each(function(i,d){
                                let input = $(d);
                                bindField(input,r);
                            });
                        }
                        
                    }
                } else if (editable || c.editable) {
                    let input = $("<input>");
                    input.attr("field",field);
                    bindField(input);
                    input.val(r[field]);
                    cellContent = input;
                } else {
                    cellContent = value;
                }
            }
            var td = $("<td>");
            if ($.isArray(cellContent)) {
                $.each(cellContent, function(i, d) {

                    td.append(d);
                });
            } else {
                if(typeof cellContent === undefined || cellContent === null){
                    cellContent = "";
                }
                td.append(cellContent);
            }

            tr.append(td);
        });
        tbody.append(tr);

        /**
         * 
         * @param {input} input 
         * @param {行数据} row 
         */
        function bindField(input,row){

            let field = $(input).attr("field");
            input.data("row", r);
            if(row){
                row[field] = input.val();
            }
            input.change(function() {
                var row = $(this).data("row");
                let field = $(input).attr("field");
                row[field] = $(this).val();
            });

        }

    }

    function fetchData(params) {

        paramMap.page = pageNo;
        paramMap.pageSize = pageSize;

        loadingSpan.show();

        var p = $.extend(true, {}, paramMap);

        if (params) {
            p = $.extend(true, paramMap, params);
        }


        $.ajax({
            url: url,
            dataType: 'json',
            type: 'post',
            data: p
        }).done(function(data) {
            handleData(data);
            if(onFinish){
                onFinish(data);
            }
            loadingSpan.hide();
        }).fail(function(e) {
            loadingSpan.remove();
            console.error(e);
        });
    }

    function reload() {
        fetchData(paramMap);
    }

}