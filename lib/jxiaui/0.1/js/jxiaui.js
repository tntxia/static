+(function(globe) {
    if (globe.JxiaUI) {
        console.warn("命名冲突。。。");
    }

    let components = [];

    let JxiaUI = function(opt) {

        let el = opt.el;
        let methods = opt.methods;

        let children = el.children();

        el.empty();

        children.each(function(i, c) {
            let tagName = c.tagName.toLowerCase();
            let comp;
            $.each(components, function(i, c) {
                if (c.tag === tagName) {
                    comp = c;
                }
                return false;
            });

            let item;
            if (comp) {
                item = new comp().render($(c), methods);
            } else {
                item = c;
            }
            el.append(item);
        });

    }
    JxiaUI.use = function(component) {
        components.push(component);
    }

    globe.JxiaUI = JxiaUI;

})(window);