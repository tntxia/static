$.fn.buildform = function(opt,scope) {

    let actions, url, params,data, toolbar, onFinish;

    if (opt) {
        actions = opt.actions;
        url = opt.url;
        params = opt.params;
        toolbar = opt.toolbar; 
        data = opt.data;
        onFinish = opt.onFinish;
    }

    var mapping = {
        "select": Select,
        "rich-editor": RichEditor,
        "hidden": Hidden,
        "textfield": TextField,
        "date": DateUI,
        "choose": Choose,
        "number":NumberUI
    }

    var container = this;
    var form = new Form(container);
    container.find("[ui]").each(function(i, d) {
        var component = $(this).attr("ui");
        var name = $(this).attr("name");
        var HandlerModel = mapping[component];
        form.addItem(name, new HandlerModel($(this)));
    });

    container.find("[action]").each(function(i, d) {
        $(this).click(function() {
            var actionName = $(this).attr("action");
            invokeAction(actionName);
        });
    });

    container.find("[change-action]").each(function() {
        $(this).change(function() {
            var actionName = $(this).attr("change-action");
            var value = $(this).val();
            invokeAction(actionName,value);
        });
    })

    if (url) {
        $.ajax({
            url: url,
            data:params
        }).done(res => {
            form.setValues(res);
            if(onFinish){
                onFinish(res);
            }
        })
    }

    if(data){
        form.setValues(data);
    }

    if (toolbar) {
        let toolbarContainer = container.find(toolbar.selector);
        if (toolbar.url) {
            $.ajax({
                url: toolbar.url
            }).done(res => {
                $.each(res, function(i, d) {
                    let but = $("<button>", {
                        text: d.text,
                        action: d.action
                    });
                    but.click(e => {
                        let action = $(this).attr("action");
                        actions[action].call(form);
                    })
                    toolbarContainer.append(but);
                })

            })
        }
    }

    return form;

    function invokeAction(actionName, value) {
        actions[actionName].call(form, value);
    }

    function Form(container) {

        this.container = container;
        let items = {};

        this.getParamMap = function() {
            var res = {};

            let container = this.container;

            let that = this;

            container.find(":input[name]").each(function(i, inp) {
                let name = $(inp).attr("name");
                let value = that.getValue(name);
                res[name] = value;
            });

            for (let itemName in items) {
                var item = items[itemName];
                let name = item.getName();
                let value = item.getValue();
                res[name] = value;
            }
            return res;
        }

        this.getValue = function(name) {
            let input = container.find("[name=" + name + "]");
            if (isRadioInput(input)) {
                let val;
                input.each(function() {
                    if ($(this).prop("checked")) {
                        val = $(this).val();
                    }
                });
                return val;
            }
            return input.val();
        }

        this.setValue = function(name, value) {
            var item = items[name];
            if (item) {
                if (item.setValue)
                    item.setValue(value);
            } else {
                let input = container.find("[name=" + name + "]");
                // 如果不存在，不需要处理
                if (input.length == 0) {
                    return;
                }

                if (isRadioInput(input)) {
                    input.each(function() {
                        var v = $(this).val();
                        if (v == value) {
                            $(this).prop("checked", true);
                        }
                    });
                } else if (input.get(0).tagName == "LABEL") {
                    input.html(value);
                } else {
                    input.val(value);
                }

            }

        }
        this.setValues = function(values) {
            for (key in values) {
                var value = values[key];
                this.setValue(key, value);
            }
        }
        this.addItem = function(name, item) {
            items[name] = item;
        }

        function isRadioInput(input) {
            let isAllRadio = true;
            input.each(function() {
                var r = $(this);
                if (r.attr("type") != "radio") {
                    isAllRadio = false;
                }
            });
            return isAllRadio;

        }
    }

    function Hidden(target) {
        target.attr("type", "hidden");

        this.getName = function() {
            return target.attr("name");
        }

        this.setValue = function(value) {
            target.val(value)
        }

        this.getValue = function(value) {
            return target.val();
        }
    }

    function Select(target) {

        var url = target.attr("url");
        var label = target.attr("label");
        var valueField = target.attr("value");

        var onFinish = target.attr("onfinish");


        let valueStore;
        $.ajax({
            url: url
        }).done(function(data) {

            var selectValue;

            $.each(data, function(i, d) {
                let option = $("<option>");
                let labelValue;
                let valueValue;
                if (!valueField) {
                    labelValue = d;
                    valueValue = d;
                } else {
                    labelValue = d[label];
                    valueValue = d[valueField];
                }
                option.text(labelValue);
                option.attr("value", valueValue);

                if (valueValue == valueStore || d.selected) {
                    selectValue = valueValue;
                    option.prop("selected", true);
                }
                target.append(option);
            });

            let finishAction = actions[onFinish];
            if(finishAction){
                finishAction(selectValue);
            }
            
        })
        this.getName = function() {
            return target.attr("name");
        }

        this.setValue = function(val) {
            valueStore = val;
            target.val(val);
        }

        this.getValue = function() {
            return target.val();
        }
    }

    /**
     * 富文本折编辑器
     * 
     * @Author tntxia
     * 
     */
    function RichEditor(target) {

        var orginHTML = $(target).html();

        target.empty();

        var toolbar = $("<div>", {
            'class': "toolbar"
        });
        toolbar.css({
            display: 'flex'
        })

        var addPicBtn = $("<div>", {
            'class': 'btn'
        });
        addPicBtn.css({
            position: 'relative',
            overflow: 'hidden',
            width: 30,
            height: 25,
            border: '1px solid #ccc'
        });

        var hiddenUploadForm = $("<form>", {
            enctype: "multipart/form-data",
            method: "post",
            action: "/file_center/file!upload.do",
        });
        var fileinput = $("<input>", {
            type: 'file',
            name: 'upload_file_rich_editor'
        });
        fileinput.change(function() {
            hiddenUploadForm.ajaxSubmit({
                success: function(data) {
                    var innerDom = contentWindow.document;
                    var el = innerDom.createElement("img");
                    el.src = "/file_center/file!showPic.do?uuid=" + data.uuid;
                    el.width = 100;
                    el.height = 100;
                    body.append(el);
                    console.log(data);
                },
                error: function(error) { alert(error); },
                type: "post",
                /*设置表单以post方法提交*/
                dataType: "json" /*设置返回值类型为文本*/
            });
        });

        hiddenUploadForm.append(fileinput);
        hiddenUploadForm.hide();
        $("body").append(hiddenUploadForm);
        addPicBtn.click(function() {
            fileinput.click();
        })

        var maskDiv = $("<div>");
        maskDiv.css({
            background: 'white',
            position: 'absolute',
            width: 30,
            height: 25,
            top: 0,
            left: 0
        });
        addPicBtn.append(maskDiv);

        var icon = $("<span>", {
            'class': 'glyphicon glyphicon-picture'
        });
        maskDiv.append(icon);

        toolbar.append(addPicBtn);


        let colorSelect = $("<div>",{
            text: '字体颜色'
        });
        colorSelect.css({
            width: 50,
            height: 25,
            display: 'block',
            color:'white',
            background: '#000000',
            border: '1px solid #ccc',
            position: 'relative',
            cursor:'pointer',
            margin: "0 10px 0 10px"
        });
        colorSelect.click(function(e){
            $(this).find("ul").toggle();
        })

        let ul = $("<ul>");
        ul.css({
            position:'absolute',
            top: 25,
            display:'none',
            "margin":0,
            "padding":0,
            "list-style":"none"
        });
        let colorList = ["#ff0000","#00ff00","#0000ff","#000000"];
        for(let i = 0;i<colorList.length;i++) {
            let color = colorList[i];
            let li = $("<li>",{
                text: color
            });
            li.css({
                "background": color,
                "list-style":"none"
            });
            li.click(function(){
                let color = $(this).text();
                var innerDom = contentWindow.document;

                innerDom.body.focus();
    
                var colorSpan = innerDom.createElement("span");
                colorSpan.innerHTML = "&nbsp;"
                colorSpan.style = "color:"+color;
    
                innerDom.body.appendChild(colorSpan);
    
                var range = innerDom.createRange();
                range.selectNodeContents(colorSpan);
                range.collapse(false);
                var sel = contentWindow.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                colorSpan.focus();
                colorSelect.css("background", color);
            })
            ul.append(li);
        }
        colorSelect.append(ul);

        toolbar.append(colorSelect);

        target.append(toolbar);
        var iframe = $("<iframe>");
        iframe.css("width", "100%");
        target.append(iframe);

        var contentWindow = iframe.get(0).contentWindow;
        contentWindow.document.designMode = "on";
        contentWindow.document.contentEditable = true;

        //但是IE与FireFox有点不同，为了兼容FireFox，所以必须创建一个新的document。
        contentWindow.document.open();
        contentWindow.document.writeln('<html><body></body></html>');
        contentWindow.document.close();
        var body = contentWindow.document.body;
        body.innerHTML = orginHTML;

        this.getName = function() {
            return target.attr("name");
        }

        this.setValue = function(html) {
            contentWindow.document.body.innerHTML = html;
        }

        this.getValue = function() {
            return contentWindow.document.body.innerHTML;
        }
    }

    /**
     * 文本输入
     */
    function TextField(target) {

        this.getName = function() {
            return target.attr("name");
        }

        this.setValue = function(value) {
            target.val(value)
        }

        this.getValue = function(value) {
            return target.val();
        }
    }

    function DateUI(target) {
        var tagName = target.get(0).tagName;
        let isLabel = tagName == "LABEL";
        if (isLabel) {
            target.text(getSimpleStrNow());
        } else {
            let showNow = target.attr("show-now")=="true";
            target.datepick({
                showNowDate:showNow
            });
        }

        this.getName = function() {
            if (isLabel) {
                return null;
            }
            return target.attr("name");
        }

        this.setValue = function(v) {
            if (isLabel) {
                target.text(v);
            } else {
                target.val(v);
            }
        }

        this.getValue = function() {
            if (isLabel) {
                return null;
            }
            return target.val();
        }

        function getSimpleStrNow() {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (date < 10) {
                date = "0" + date;
            }
            return year + "-" + month + "-" + date;
        }
    }

    function Choose(target) {
        var chooseAction = target.attr("choose-action");
        let span = $("<span>", {
            'class': 'choose-btn'
        });
        span.click(function() {
            if (chooseAction) {
                actions[chooseAction].call(form, target.val());
            }

        });
        span.insertAfter(target);

        this.getName = function() {
            return target.attr("name");
        }

        this.getValue = function() {
            return target.val();
        }

        this.setValue = function(value) {
            target.val(value);
        }
    }

    function NumberUI(target){
        target.attr("type","number");
        if(!target.val()){
            target.val("0");
        }

        this.getName = function() {
            return target.attr("name");
        }

        this.getValue = function() {
            return target.val();
        }

        this.setValue = function(value) {
            target.val(value);
        }
    }

}