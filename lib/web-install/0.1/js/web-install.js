(function(globe) {
var pathName = window.location.pathname.substring(1);
var webRoot = pathName == '' ? '' : "/" + pathName.substring(0, pathName.indexOf('/'));
if (webRoot == '/') {
    webRoot = '';
}
globe.webRoot = webRoot;

// 等待文档加载完成
window.addEventListener("load", function() {
    let webApp = new WebApp();
    window.webApp = webApp;
});

function getResourcePath() {
    let scripts = document.querySelectorAll("head>script");
    let res;
    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];
        let src = script.src;
        if (src && src.indexOf("web-install") >= 0) {
            let attributes = script.attributes;
            res = getAttrValue(attributes, "resource-path");
        }
    }
    return res;
}

function getAttrValue(attrs, key) {
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        let name = attr.name;
        if (key === name) {
            return attr.nodeValue;
        }
    }
}

function appendMsg(container, msg) {
    let msgDiv = document.createElement("div");
    msgDiv.innerText = msg;
    container.appendChild(msgDiv);
}

function getJSON(url) {
    let promise = new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("get", url, true, "", "");
        xhr.send(null);
        xhr.onload = function() {
            console.log("status", xhr.status);
            if (xhr.status === 200) {
                let responseText = xhr.responseText;
                resolve(JSON.parse(responseText));
            } else {
                reject(xhr.status);
            }
        };
    });
    return promise;
}

function http(url) {
    let promise = new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("get", url, true, "", "");
        xhr.send(null);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let responseText = xhr.responseText;
                resolve(responseText);
            } else {
                reject(xhr.status);
            }

        };
    });
    return promise;
}

function Layout() {
    this.leftbarWidth = 110;
    let router = new Router();
    this.router = router;
    window.router = router;
}

Layout.prototype.install = function(opt) {

    // 布局的容器
    let container = opt.container;
    if (!container) {
        container = $(document.body);
    }
    this.width = container.get(0).clientWidth;
    let me = this;
    me.opt = opt;

    let routerConfig = opt.router;
    let mainLayout = $("<div>", {
        'class': 'main-layout'
    });
    container.append(mainLayout);
    me.el = mainLayout;

    // 头部的高度
    let headerHeight = opt.header.height;
    this.headerHeight = headerHeight;
    header.css({
        height: headerHeight
    })
    mainLayout.append(header);

    if (opt.leftbar) {
        let leftbar = new Leftbar(me);
        this.leftbar = leftbar;
    }

    this.main = new LayoutMain(this);

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
    if (dialogs) {
        dialogs.forEach(comp => {
            let compEl = $("<" + comp.name + ">");
            compEl.attr("ref", comp.ref);
            dialogsDiv.append(compEl);
        });
    }

    this.dialogVue = new Vue({
        el: dialogsDiv.get(0),
        methods: {
            getDialog(name) {
                return this.$refs[name];
            }
        }
    })

    header.load(headerTemplate, () => {
        let headVue = new Vue({
            el: header.get(0),
            data: {
                module: null
            }
        });
        router.onChange(function(moduleName) {
            headVue.module = moduleName;
        });

        if (me.leftbar) {
            me.leftbar.init().then(function() {
                me.registerRouter();
            });
        } else {
            me.registerRouter();
        }

    }, (e) => {
        reject(e);
    });
}

Layout.prototype.registerRouter = function() {

    let layout = this;
    let opt = layout.opt;
    let routerConfig = opt.router;

    let mapping = routerConfig.moduleMapping;
    let mainSec = this.mainSec;
    let router = this.router;

    routerConfig.resourcePath = opt.resourcePath;
    router.setConfig(routerConfig);
    router.register({
        target: mainSec,
        mapping: mapping,
        onChange(moduleName) {
            let module;
            if (mapping) {
                module = mapping[moduleName];
            }
            if (!module) {
                module = window.modules[moduleName];
            }
            let leftbarFlag = module.leftbar;
            let type;
            if (moduleName.indexOf("/") >= 0) {
                type = moduleName.split("/")[0];
            } else {
                type = moduleName.split("_")[0];
            }

            if (layout.leftbar) {
                if (leftbarFlag === false) {
                    layout.hideLeftbar();
                    return;
                }
                layout.setLeftbar(type, moduleName);
                layout.showLeftbar();
            }

            webApp.lastGroup = type;
        }
    });
    webApp.router = router;
}

Layout.prototype.append = function(el) {
    this.container.append(el);
}

Layout.prototype.setLeftbar = function(type, moduleName) {
    let me = this;
    let leftbar = this.leftbar;

    // 判断左边菜单是否初始化
    let isLeftbarInit = this.isLeftbarInit;
    // 上次的左侧菜单类型
    let lastType = this.lastLeftbarType;
    if (!isLeftbarInit || lastType != type) {
        this.leftbar.show(type);
        me.selectLeftbar(moduleName);
        me.lastLeftbarType = type;
    } else {
        me.selectLeftbar(moduleName);
    }
}

Layout.prototype.hideLeftbar = function(data) {
    let leftbar = this.leftbar;
    leftbar.hide();
    let mainDiv = this.mainDiv;
    mainDiv.css({
        left: 0,
        width: this.width
    })
}

Layout.prototype.showLeftbar = function(data) {
    let leftbarWidth = this.leftbar.width;
    let mainDiv = this.mainDiv;
    mainDiv.css({
        left: leftbarWidth,
        width: this.width - leftbarWidth
    });
}

Layout.prototype.selectLeftbar = function(route) {
    let leftbar = this.leftbar;
    leftbar.select(route);
}

Layout.prototype.showDialog = function(ref) {
    let dialog = this.dialogVue.$refs[ref];
    dialog.show();
    return dialog;
}
// Web Application
function WebApp() {
    let me = this;
    // 获取静态资源的路径
    let resourcePath = getResourcePath();
    this.resourcePath = resourcePath;
    let promise = this.prepareNecessaryJs();
    promise.then(function() {
        me.install();
    });
}

WebApp.prototype.download = function(url) {
    let downloadIframe;
    if (this.downloadIframe) {
        downloadIframe = this.downloadIframe;
    } else {
        downloadIframe = document.createElement("iframe");
        document.body.appendChild(downloadIframe);
        this.downloadIframe = downloadIframe;
    }
    downloadIframe.src = url;
}

// 准备必须的文件
WebApp.prototype.prepareNecessaryJs = function() {
    // 获取静态资源的路径
    let resourcePath = this.resourcePath;
    let compPath = resourcePath + "/components/components.js";
    let jsList = ["/static/lib/jquery/jquery.js", "/static/lib/vue/vue.js", "/static/lib/vue/vue-resource.js", "/static/lib/jxiaui/0.1/dist/jxiaui.js", compPath];
    return new Promise(function(resolve, reject) {
        installAllJs(jsList, resolve, reject);
    });

}

WebApp.prototype.install = function() {
    let webApp = this;
    // 获取静态资源的路径
    let resourcePath = this.resourcePath;

    let template = "<div id=\"web-app\" class=\"web-container\">\r\n    <div class=\"install-msg-container\">\r\n        <div v-for=\"m in installMsg\">{{m}}</div>\r\n    </div>\r\n    <div class=\"main-layout\">\r\n        <div class=\"main-layout-header\">\r\n            <header-main></header-main>\r\n        </div>\r\n        <leftbar ref=\"leftbar\">\r\n\r\n        </leftbar>\r\n    </div>\r\n</div>";
    $(document.body).html(template);

    let vm = new Vue({
        el: '#web-app',
        data: {
            installMsg: []
        },
        components: {
            'leftbar': {
                template: "<div class='leftbar' :style='getStyle()'><jxiaui-tree :data='treeData'></jxiaui-tree></div>",
                mounted() {
                    if (this.width) {
                        this.barWidth = this.width;
                    }
                },
                data() {
                    return {
                        treeData: null,
                        width: 120,
                        url: null
                    }
                },
                methods: {
                    loadData() {

                    },
                    setWidth(width) {
                        this.width = width;
                    },
                    getStyle() {
                        return {
                            width: this.width + "px"
                        }
                    }
                },
                watch: {}
            }
        },
        mounted: function() {
            this.init();
        },
        methods: {
            init() {
                let me = this;
                // Web应用配置的JSON路径
                let configUrl = resourcePath + "/json/webConfig.json";
                let t1 = new Date();
                this.installMsg.push("正在加载Web的配置信息。。。");

                getJSON(configUrl).then(function(res) {
                    let leftbar = res.layout.leftbar;
                    me.setLeftbarWidth(leftbar.width);
                    me.config = res;
                    let t2 = new Date();
                    me.installMsg.push("加载Web的配置信息完成，用时：" + (t2.getTime() - t1.getTime()));
                    me.installMsg.push("开始加载所有的JS和CSS。。。。");
                    let cssList = res.cssList;

                    let components = res.components;
                    let dialogs = res.dialogs;
                    let version = res.version;
                    let title = res.title;
                    if (title) {
                        document.title = title;
                    }
                    let jsList = [];
                    for (let i = 0; i < res.jsList.length; i++) {
                        jsList.push(res.jsList[i]);
                    }
                    webApp.moduleMapping = res.moduleMapping;
                    let layout = res.layout;
                    layout.dialogs = dialogs;
                    if (components) {
                        components.map(function(c) {
                            jsList.push(c.url);
                        })
                    }
                    if (dialogs) {
                        dialogs.map(function(c) {
                            jsList.push(c.url);
                        })
                    }
                    installAllCSSAndJS(cssList, jsList, version).then(function() {
                        let t3 = new Date();
                        me.installMsg.push("加载所有的JS和CSS完成，用时：" + (t3.getTime() - t2.getTime()));
                        me.installMsg = [];
                        if (!layout) {
                            return;
                        }
                        webApp.installLayout(layout, dialogs)
                    });
                }, function(errorStatus) {
                    appendMsg(installMsgContainer, "加载Web的配置信息失败:" + errorStatus);
                });
            },
            setLeftbarWidth(width) {
                this.$refs.leftbar.setWidth(width);
            }
        }
    });



}

WebApp.prototype.installLayout = function(layoutConfig) {
    let resourcePath = this.resourcePath;
    let layout = new Layout();
    this.layout = layout;
    layoutConfig.resourcePath = resourcePath;
    layout.install(layoutConfig);
}

function installAllCSSAndJS(cssList, jsList, version) {
    return new Promise(function(resolve, reject) {
        installAllCss(cssList);
        installAllJs(jsList, resolve, reject, version);
    });
}

function installAllCss(cssList) {
    let head = document.getElementsByTagName('head')[0];
    cssList.forEach(css => {
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = css;
        head.appendChild(link);
    })
}

function installAllJs(jsList, resolve, reject, version) {
    if (!jsList || !jsList.length) {
        resolve();
        return;
    }
    installJs(jsList, resolve, reject, version);
}

function installJs(jsList, resolve, reject, version) {
    if (!jsList.length) {
        resolve();
        return;
    }
    let js = jsList.splice(0, 1);
    let promise = installJsNode(js, version);
    promise.then(() => {
        installJs(jsList, resolve, reject, version);
    }, e => {
        reject(e);
    });
    return promise;
}

function installJsNode(src, version) {

    let p = new Promise((resolve, reject) => {
        var node = document.createElement('script');
        node.type = 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        node.src = src + "?" + version;
        node.addEventListener('load', function() {
            resolve();
        }, false);
        node.addEventListener('error', function(e) {
            reject(e);
        }, false);
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(node);
    });
    return p;
}
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
function LayoutMain(parent) {

    let parentWidth = parent.width;
    let leftbarWidth = 0;
    if (parent.leftbar) {
        leftbarWidth = parent.leftbar.width;
    }
    let mainSecWidth = parentWidth - leftbarWidth;
    parent.mainSecWidth = mainSecWidth;

    let layoutMainDiv = $("<div>", {
        'class': 'layout-main'
    });
    let headerHeight = parent.headerHeight;
    layoutMainDiv.css({
        left: leftbarWidth,
        top: headerHeight,
        width: mainSecWidth
    });
    parent.el.append(layoutMainDiv);
    parent.mainDiv = layoutMainDiv;

    let mainOpt = parent.opt.main;
    if (mainOpt.crumb) {
        let crumbDiv = $("<div>", {
            'class': 'layout-main-crumb'
        });
        layoutMainDiv.append(crumbDiv);
        parent.opt.router.crumbDiv = crumbDiv;
        parent.crumbDiv = crumbDiv;
    }

    let mainSection = $("<div>", {
        'class': 'main_sec'
    });
    parent.mainSec = mainSection;
    layoutMainDiv.append(mainSection);
}
})(window);