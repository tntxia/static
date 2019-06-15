+(function(globe) {

    if (!globe.JxiaUI) {
        console.warn("你似乎还没有引用JxiaUI的核心包。。。");
        return;
    }

    var Tabs = function() {};
    Tabs.tag = "jxia-datagrid";
    Tabs.prototype.cols = [];
    Tabs.prototype.render = function(el, methods) {

        let me = this;

        let div = $("<div>", {
            'class': "jxia-datagrid"
        });

        var tabsHead = $("<div>", {
            'class': 'jxia-datagrid-head'
        });
        div.append(tabsHead);

        var tabsBody = $("<div>", {
            'class': 'jxia-tabs-body'
        });
        div.append(tabsBody);

        var tabsItems = el.find("jxia-datagrid-item");
        tabsItems.each(function(i) {
            let el = $(this);
            let label = el.attr("label");
            let field = el.attr("field");
        });

        return div;
    }

    globe.JxiaUI.use(Tabs);

})(window);