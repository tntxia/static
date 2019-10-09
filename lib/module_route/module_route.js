/**
 * 
 * 路由管理
 * 
 */
(function(global, factory) {
    factory(global);
})(typeof window !== "undefined" ? window : this, function(window) {
    let router = {};
    // 将变量注册到全局变量
    window.router = router;

    let lastRoute;
    let lastParams;

    let changeActions;
    let defaultModule;

    router.getRoute = function() {
        return getRoute();
    }

    router.setDefaultModule = function(module) {
        defaultModule = module;
    }

    router.register = function(opt) {

        let t = new Date().getTime();

        let target = opt.target;
        if (opt.defaultModule) {
            defaultModule = opt.defaultModule;
        }

        let mapping = opt.mapping;
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

        setModule();
        $(window).on("hashchange", function(e) {
            setModule();
        });

        function setModule() {
            var moduleName = getRoute();
            if (!moduleName) {
                if (defaultModule) {
                    goRoute(defaultModule);
                }
                return;
            }

            lastRoute = moduleName;


            if (!window.modules || !window.modules[moduleName]) {

                var node = document.createElement('script');
                node.type = 'text/javascript';
                node.charset = 'utf-8';
                node.async = true;
                let src;

                if (!mapping || !mapping[moduleName]) {
                    src = resourcePath + "modules/" + moduleName + ".module.js?" + t;
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
                    template = resourcePath + "template/" + moduleName + ".html";
                }
            }


            console.log("template", template);

            target.load(template + "?" + t, function(html) {
                if (module.init) {
                    module.init();
                }

            });
        }
    };

    router.onChange = function(action) {
        pushInChangeActions(action);
    }

    router.getParams = function() {
        return getRouteDetail().params;
    }

    router.getParam = function(name) {
        let params = getRouteDetail().params;
        if (!params) {
            return null;
        }
        return decodeURI(params[name]);
    }

    router.back = function() {
        goRoute(lastRoute, lastParams);
    }

    router.goRoute = function(route, params) {
        goRoute(route, params);
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
});