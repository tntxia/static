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

    let template = <%=template%>;
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
                    setUrl(url) {
                        this.url = url;
                    },
                    getStyle() {
                        return {
                            width: this.width + "px"
                        }
                    }
                },
                watch: {
                    url() {
                        if (this.url) {
                            let url = this.url;
                            $.ajax({
                                url: url,
                                cache: false
                            }).done(data => {
                                me.data = data;
                            })
                        }
                    }
                }
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
                    me.setLeftbarUrl(leftbar.url);
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
            },
            setLeftbarUrl(url) {
                this.$refs.leftbar.setUrl(url);
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