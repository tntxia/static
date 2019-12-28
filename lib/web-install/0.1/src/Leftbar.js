function Leftbar(layout) {

    // 布局的配置信息
    let layoutOpt = layout.opt;
    // 头部的高度
    let headerHeight = layoutOpt.header.height;
    // 默认左边菜单的宽度 110px
    let width = 110;
    // 左边菜单的配置信息
    let opt = layoutOpt.leftbar;
    this.opt = opt;
    if (opt && opt.width) {
        width = opt.width;
    }
    this.width = width;

    let el = $("<div>", {
        'class': 'leftbar'
    });
    el.css({
        top: headerHeight,
        width: width
    });
    layout.el.append(el);
    this.el = el;
}

Leftbar.prototype.init = function() {
    let me = this;
    let leftbar = this.leftbar;
    let url = 'leftbar.do';
    let opt = this.opt;
    if (opt && opt.url) {
        url = opt.url;
    }
    let promise = new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            cache: false
        }).done(data => {
            me.data = data;
            resolve();
        })
    });
    return promise;
}

Leftbar.prototype.show = function(type) {
    this.el.show();
    this.el.empty();
    let data = this.data;
    if (!$.isArray(data)) {
        data = data[type];
    }
    data.forEach(item => {
        let buttons = item.buttons;
        if (buttons && buttons.length) {
            buttons.forEach(button => {
                button.selected = false;
            })
        }
    });
    let el = this.el;
    data.forEach(d => {
        let item = $("<div>", {
            'class': 'leftbar-item'
        });
        let head = $("<div>", {
            'class': 'leftbar-header',
            text: d.text || d.name
        })
        item.append(head);
        let list = $("<ul>", {
            'class': 'leftbar-list'
        });
        item.append(list);
        let buttons = d.buttons;
        if (buttons) {
            buttons.forEach(but => {
                let li = $("<li>");
                if (but.selected) {
                    li.addClass("selected");
                }
                list.append(li);
                let a = $("<a>", {
                    href: but.url,
                    text: but.text || but.name,
                    target: but.target
                });
                li.append(a);
            });
        }

        el.append(item);
    });
}

Leftbar.prototype.hide = function(type) {
    this.el.hide();
}

Leftbar.prototype.select = function(route) {
    let el = this.el;
    let liList = el.find("li");
    liList.removeClass("selected");
    liList.each(function() {
        let href = $(this).find("a").attr("href");
        let module = href.substring(1);
        if (route.indexOf(module) === 0) {
            $(this).addClass("selected");
        }
    });
}