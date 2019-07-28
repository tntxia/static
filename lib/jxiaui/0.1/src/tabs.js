module.exports = {
    name: 'jxiaui-tabs',
    render(h) {
        let me = this;

        let domTree = {
            tag: 'div',
            options: {
                'class': 'jxiaui-tabs'
            }
        };

        append(domTree, this.$slots.default);

        let headDiv = {
            tag: 'div',
            options: {
                'class': 'jxiaui-tabs-head'
            }
        }
        append(domTree, headDiv);

        let items = this.items;
        items.forEach(item=> {
            let classes = ['jxiaui-tabs-head-item'];
            if (item.active) {
                classes.push("active");
            }
            let headItem = {
                tag: 'div',
                options: {
                    'class': classes,
                    on: {
                        click: function() {
                            console.log(item);
                        }
                    }
                },
                children: [item.label]
            }
            append(headDiv, headItem);
        });

        let contentDiv = {
            tag: 'div',
            options: {
                'class': 'jxiaui-tabs-content'
            }
        }
        append(domTree, contentDiv);

        items.forEach(item=> {
            let display;
            if (item.active) {
                display = ""
            } else {
                display = "none"
            }
            let content = item.content;
            let children = [];
            debugger
            if (isArray(content)) {
                content.forEach(c=> {
                    if (isVNode(c) || typeof c === "string" || typeof c === "number") {
                        children.push(c);
                    } else {
                        children.push(h(c));
                    }
                })
            } else {
                if (isVNode(content) || typeof content === "string" || typeof content === "number") {
                    children.push(content);
                } else {
                    children.push(h(content));
                }
            }
            let contentItemDiv = {
                tag: 'div',
                options: {
                    'class': 'jxiaui-tabs-content-item',
                    style: {
                        'display': display
                    }
                },
                children: children
            }
            append(contentDiv, contentItemDiv);
        });

        return createDom(domTree);

        function createDom(el) {
            let tag = el.tag;
            let opt = el.options;
            if (!opt) {
                opt = {};
            }
            let children = [];
            if (el.children && el.children.length) {
                for (let i = 0; i < el.children.length; i++) {
                    let child = el.children[i];
                    if (!child) {
                        children.push("");
                    } else {
                        if (isVNode(child) || typeof child === "string") {
                            children.push(child);
                        } else if (typeof child === "number") {
                            children.push(child + "");
                        } else {
                            children.push(createDom(child));
                        }
                    }

                }
            }
            return h(el.tag, opt, children);
        }

        function append(el, children) {
            if (!el.children) {
                el.children = [];
            }

            if (children.length) {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    el.children.push(child);
                }
            } else {
                el.children.push(children);
            }
        }

        function isVNode(el) {
            if (el && el.constructor && el.constructor.name === "VNode") {
                return true;
            }
            return false;
        }
    },
    data() {
        return {
            items: []
        }
    },
    mounted() {
        
    },
    updated() {

    },
    methods: {
        tabJoinIn(tab) {
            if (!this.items.length) {
                tab.active = true;
            } else {
                tab.active = false;
            }
            this.items.push(tab);
        },
        addTab(item) {
            this.items.forEach(item => {
                item.active = false;
            });
            item.active = true;
            this.items.push(item);
        },
        activeTab(item) {
            item.active = true;
            item.comp.visible = true;
        }
    }
}

function isArray(val) {
    return typeof val.length === "number"
}