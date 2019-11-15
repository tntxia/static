/**
 * 
 * 路由管理
 * 
 */
(function(global, factory) {
    factory(global);
})(typeof window !== "undefined" ? window : this, function(window) {

    let Router = function() {};

    Router.prototype.setConfig = function(config) {
        this.config = config;
        this.t = new Date().getTime();
    }

    let lastRoute;
    let lastParams;

    let changeActions;

    Router.prototype.getRoute = function() {
        return getRoute();
    }

    Router.prototype.setDefaultModule = function(module) {
        if (!this.config) {
            this.config = {};
        }
        this.config.defaultModule = module;
    }

    Router.prototype.register = function(opt) {
        let me = this;
        let target = opt.target;
        this.target = target;


        let defaultModule;
        if (opt.defaultModule) {
            defaultModule = opt.defaultModule;
            this.setDefaultModule(defaultModule);
        } else {
            defaultModule = this.config.defaultModule;
        }

        let mapping = opt.mapping;
        this.config.mapping = mapping;
        let resourcePath = opt.resourcePath;
        if (resourcePath) {
            resourcePath += "/";
        } else {
            resourcePath = "";
        }
        let onChange = opt.onChange;
        if (onChange) {
            pushInChangeActions(onChange);
        }

        me.renderModule();
        $(window).on("hashchange", function(e) {
            me.renderModule();
        });
    };

    // 渲染当前模块
    Router.prototype.renderModule = function() {
        var moduleName = getRoute();
        if (!moduleName) {
            let defaultModule = this.config.defaultModule;
            if (defaultModule) {
                goRoute(defaultModule);
            }
            return;
        }

        let config = this.config;
        let tree = config.tree;
        let target = this.target;

        let routePath = getRoutePath(tree, moduleName.split("/"));
        let routePathEnd = routePath[routePath.length - 1];

        if (routePathEnd) {
            let pathIndex = routePathEnd.index;
            if (pathIndex) {
                goRoute(moduleName + "/" + pathIndex);
                return;
            }
        }
        let crumbDiv = config.crumbDiv;
        let mapping = config.mapping;
        let resourcePath = this.config.resourcePath;

        console.log("tree", tree);

        let pathAll = "";
        if (crumbDiv) {
            crumbDiv.empty();
            routePath.forEach((r, i) => {
                if (!r) {
                    return;
                }
                let name = r.name;
                let index = r.index;
                if (pathAll) {
                    crumbDiv.append(">>");
                    pathAll += "/" + name;
                } else {
                    pathAll = name;
                }
                let routeItem;
                if (pathAll + "/" + index === moduleName || pathAll === moduleName) {
                    routeItem = r.label;
                } else {
                    routeItem = $("<a>", {
                        href: '#' + pathAll,
                        text: r.label
                    });
                }
                crumbDiv.append(routeItem);
            })
        }


        lastRoute = moduleName;
        if (!window.modules || !window.modules[moduleName]) {

            var node = document.createElement('script');
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;
            let src;


            if (!mapping || !mapping[moduleName]) {
                let t = this.t;
                src = resourcePath + "/modules/" + moduleName + ".module.js?" + t;
            } else {
                src = mapping[moduleName].path;
            }
            node.src = src;
            node.addEventListener('load', function() {
                console.log("load module arguments", arguments);
                doChangeActions(moduleName);
                loadTemplate();
            }, false);
            node.addEventListener('error', function() {

            }, false);
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(node);
        } else {
            doChangeActions(moduleName);
            loadTemplate();
        }

        function loadTemplate() {
            var moduleName = getRoute();
            let module = window.modules[moduleName];
            let template;
            if (mapping && mapping[moduleName]) {
                template = mapping[moduleName].template;
            } else {
                if (module.template) {
                    template = module.template;
                } else {
                    template = resourcePath + "/template/" + moduleName + ".html";
                }
            }
            let t = new Date().getTime();
            target.load(template + "?" + t, function(html) {
                if (module.init) {
                    module.init();
                }
            });
        }
    }

    Router.prototype.onChange = function(action) {
        pushInChangeActions(action);
    }

    Router.prototype.getParams = function() {
        return getRouteDetail().params;
    }

    Router.prototype.getParam = function(name) {
        let params = getRouteDetail().params;
        if (!params) {
            return null;
        }
        return decodeURI(params[name]);
    }

    Router.prototype.back = function() {
        goRoute(lastRoute, lastParams);
    }

    Router.prototype.goRoute = function(route, params) {
        goRoute(route, params);
    }

    function getRoutePath(tree, pathArr, parent) {
        let res = [];
        if (!pathArr || !pathArr.length) {
            return res;
        }
        if (!tree || !tree.length) {
            res.push(null);
            return res;
        }
        let p = pathArr.splice(0, 1);
        let node;
        tree.forEach(n => {
            if (n.name == p) {
                node = n;
            }
        });
        if (!node) {
            res.push(null);
            return res;
        }
        res.push(node);

        let children = node.children;
        if (!children) {
            return res;
        }
        if (pathArr.length && children) {
            let childrenRoutePath = getRoutePath(children, pathArr, node);
            childrenRoutePath.forEach(c => {
                res.push(c);
            })
        }
        return res;
    }

    function doChangeActions(moduleName) {
        if (changeActions) {
            for (let i = 0; i < changeActions.length; i++) {
                changeActions[i](moduleName);
            }
        }
    }

    function pushInChangeActions(action) {
        if (!changeActions) {
            changeActions = [];
        }
        changeActions.push(action);
    }

    function getRoute() {
        return getRouteDetail().route;
    }

    function getRouteDetail() {
        var hash = window.location.hash.substring(1);
        var arr = hash.split("?");
        var route = arr[0];
        var paramsStr = arr[1];
        var params;
        if (paramsStr) {
            params = getParamsObject(paramsStr);
        }
        return {
            route: route,
            params: params
        };
    }

    function getParamsObject(str) {
        var paramsArr = str.split("&");
        var params = {};
        $.each(paramsArr, function(i, d) {
            if (d) {
                var keyValArr = d.split("=");
                params[keyValArr[0]] = keyValArr[1];
            }
        });
        return params;
    }

    function goRoute(route, params) {
        let hash = "#" + route;
        lastRoute = route;
        lastParams = params;
        if (params) {
            let paramStr;
            for (let p in params) {
                if (paramStr) {
                    paramStr += "&" + p + "=" + params[p]
                } else {
                    paramStr = "?" + p + "=" + params[p]
                }

            }
            hash += paramStr;
        }
        window.location.href = hash;
    }

    // 将变量注册到全局变量
    window.Router = Router;
});