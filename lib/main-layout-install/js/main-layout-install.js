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
        this.width = container.get(0).clientWidth;
        this.leftbarWidth = 110;
    }
    MainLayout.prototype.install = function(opt) {
        let me = this;
        let container = this.container;
        let mainLayout = $("<div>", {
            'class': 'main-layout'
        });
        container.append(mainLayout);
        let containerHeight = container.height();
        let leftbarWidth = opt.leftbarWidth;
        if (!leftbarWidth) {
            leftbarWidth = 110;
        }
        let mainSecWidth = this.width - leftbarWidth;
        this.mainSecWidth = mainSecWidth;
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
        leftbar.css({
            top: headerHeight,
            width: leftbarWidth
        });
        this.leftbarContainer = leftbar;
        let mainHeight = containerHeight - headerHeight;

        mainLayout.append(leftbar);
        let mainSection = $("<div>", {
            'class': 'main_sec'
        });
        this.mainSec = mainSection;
        mainSection.css({
            left: leftbarWidth,
            top: headerHeight,
            width: mainSecWidth
        });
        mainLayout.append(mainSection);

        let dialogsDiv = $("<div>", {
            id: 'dialogsDiv'
        });
        this.dialogsDiv = dialogsDiv;
        dialogsDiv.css({
            position: 'relative',
            'z-index': 10000
        })
        mainLayout.append(dialogsDiv);

        let dialogs = opt.dialogs;
        dialogs.forEach(comp => {
            let compEl = $("<" + comp.name + ">");
            compEl.attr("ref", comp.ref);
            dialogsDiv.append(compEl);
        });

        this.dialogVue = new Vue({
            el: dialogsDiv.get(0),
            methods: {
                getDialog(name) {
                    return this.$refs[name];
                }
            }
        })

        let p = new Promise((resolve, reject) => {
            header.load(headerTemplate, () => {
                resolve(me);
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

    MainLayout.prototype.hideLeftbar = function(data) {
        let leftbar = this.leftbarContainer;
        leftbar.hide();
        let mainSec = this.mainSec;
        mainSec.css({
            left: 0,
            width: this.width
        })
    }

    MainLayout.prototype.showLeftbar = function(data) {
        let leftbar = this.leftbarContainer;
        leftbar.show();
        let mainSec = this.mainSec;
        mainSec.css({
            width: this.width - this.leftbarWidth
        });
    }

    MainLayout.prototype.selectLeftbar = function(route) {
        let leftbar = this.leftbarContainer;
        let liList = leftbar.find("li");
        liList.removeClass("selected");
        liList.each(function() {
            let href = $(this).find("a").attr("href");
            if (href.endsWith(route)) {
                $(this).addClass("selected");
            }
        });
    }

    MainLayout.prototype.showDialog = function(ref) {
        let dialog = this.dialogVue.$refs[ref];
        dialog.show();
        return dialog;
    }


})(window);