(function(globe) {
    let MainLayoutInstall = {
        install(opt) {
            let p = new Promise((resolve, reject) => {
                // 布局的容器
                let container = opt.container;
                if (!container) {
                    container = $(document.body);
                }
                let mainLayout = new MainLayout(container);
                mainLayout.install(opt).then((mainLayout) => {
                    resolve(mainLayout);
                });
            });
            return p;
        }
    }
    globe.MainLayoutInstall = MainLayoutInstall;

    function MainLayout(container) {
        this.container = container;
    }
    MainLayout.prototype.install = function(opt) {
        let me = this;
        let container = this.container;
        let mainLayout = $("<div>", {
            'class': 'main-layout'
        });
        container.append(mainLayout);
        let containerHeight = container.height();
        let headerTemplate = opt.headerTemplate;
        // 头部的高度
        let headerHeight = opt.headerHeight;
        let header = $("<div>", {
            'class': 'main-layout-header'
        });
        header.css({
            height: headerHeight
        })
        mainLayout.append(header);
        let leftbar = $("<div>", {
            'class': 'leftbar'
        });
        this.leftbarContainer = leftbar;
        let mainHeight = containerHeight - headerHeight;
        leftbar.css({
            height: mainHeight
        });

        mainLayout.append(leftbar);
        let mainSection = $("<div>", {
            'class': 'main_sec'
        });
        mainSection.css({
            height: mainHeight
        });
        mainLayout.append(mainSection);

        let mainSecTemplate = opt.mainSecTemplate;

        let p = new Promise((resolve, reject) => {
            header.load(headerTemplate, () => {
                if (!mainSecTemplate) {
                    resolve(me);
                    return;
                }
                mainSection.load(mainSecTemplate, () => {
                    resolve(me);
                });
            }, (e) => {
                reject(e);
            });
        })
        return p;
    }

    MainLayout.prototype.append = function(el) {
        this.container.append(el);
    }

    MainLayout.prototype.setLeftbar = function(data) {
        let leftbar = this.leftbarContainer;
        let leftbarItems = leftbar.find(".leftbar-item");
        leftbarItems.each(function(i) {
            let item = $(this);
            if (i >= data.length) {
                item.remove();
                return;
            }
            let header = item.find(".leftbar-header");
            let dataItem = data[i];
            header.text(dataItem.text);
            let buttons = item.find(".leftbar-list li");
            let buttonsData = dataItem.buttons;
            buttons.each(function(i) {
                let d = buttonsData[i];
                let li = $(this);
                if (d.selected) {
                    li.addClass("selected");
                } else {
                    li.removeClass("selected");
                }
                let a = li.find("a");
                a.attr("href", d.url);
                a.attr("target", d.target);
                a.text(d.text);
            });
        });
        let enter = data.slice(leftbarItems.length, data.length);
        enter.forEach(d => {
            let item = $("<div>", {
                'class': 'leftbar-item'
            });
            let head = $("<div>", {
                'class': 'leftbar-header',
                text: d.text
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
                        text: but.text,
                        target: but.target
                    });
                    li.append(a);
                });
            }

            leftbar.append(item);
        });
    }


})(window);