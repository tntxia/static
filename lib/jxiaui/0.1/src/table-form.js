module.exports = {
    name: 'jxiaui-table-form',
    props: {
        itemsInRow: {
            default: 1
        },
        data: {}
    },
    render(h) {
        let me = this;

        let domTree = {
            tag: 'div',
            options: {
                'class': 'jxiaui-table-form'
            }
        };
        append(domTree, this.$slots.default);

        let table = {
            tag: 'table',
            options: {
                'class': 'jxiaui-table-form-table'
            }
        }
        append(domTree, table);

        let items = this.items;
        let tr;
        items.forEach((item, i) => {
            if (i % me.itemsInRow === 0) {
                tr = {
                    tag: 'tr',
                    options: {}
                }
                append(table, tr);
            }
            let td = {
                tag: 'td',
                options: {},
                children: [item.label]
            }
            append(tr, td);
            let content = [];
            if (item.render) {
                content.push(item.render(h, this.data));
            }
            let options = {};
            if (item.colspan > 1) {
                let attrs = options.attrs;
                if (!attrs) {
                    attrs = {};
                    options.attrs = attrs;
                }
                attrs.colspan = item.colspan * 2 - 1;
            }
            td = {
                tag: 'td',
                options: options,
                children: content
            }
            append(tr, td);
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

    }
}