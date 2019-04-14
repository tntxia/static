+(function(globe) {

    if (!globe.JxiaUI) {
        console.warn("你似乎还没有引用JxiaUI的核心包。。。");
        return;
    }

    var Tabs = function() {};
    Tabs.tag = "jxia-tabs";
    Tabs.prototype.render = function(el, methods) {

        let div = $("<div>", {
            'class': "jxia-tabs"
        });

        var tabsHead = $("<div>", {
            'class': 'jxia-tabs-head'
        });
        div.append(tabsHead);

        var tabsBody = $("<div>", {
            'class': 'jxia-tabs-body'
        });
        div.append(tabsBody);

        var tabsItems = el.find("jxia-tab");
        tabsItems.each(function(i) {
            let childTab = $(this);
            let label = childTab.attr("label");
            let template = childTab.attr("template");
            let onload = childTab.attr("onload");
            let classes = 'jxia-tabs-head-item';

            let tabEl = $("<div>", {
                'class': classes,
                text: label
            });
            tabEl.data("template", template);
            tabEl.data("onload", onload);
            if (i === 0) {
                tabEl.addClass("active");
                loadTemplate(template, onload);
            }
            tabEl.click(function() {
                tabsHead.find(".jxia-tabs-head-item").removeClass("active");
                $(this).addClass("active");
                let template = $(this).data("template");
                let onload = $(this).data("onload");
                loadTemplate(template, onload);
            });
            tabsHead.append(tabEl);
        });

        return div;

        function loadTemplate(template, onload) {
            tabsBody.load(template, function() {
                if (onload) {
                    for (let m in methods) {
                        if (m == onload) {
                            let handler = methods[m];
                            handler.call(tabsBody);
                        }
                    }
                }
            });
        }
    }

    globe.JxiaUI.use(Tabs);

})(window);