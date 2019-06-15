(function(globe){
if (!globe.Vue) {console.warn("可能你还没导入Vue的引用。。。");}
if(arguments.length<2) {console.warn('参数不对');return;}
for(let i=1;i<arguments.length;i++){
Vue.component(arguments[i].name, arguments[i]);
}
})(window, 

(()=>{let module = {};
module.exports = {
    name: 'jxiaui-tabs',
    data() {
        return {
            items: []
        }
    },
    mounted() {
        let slotDefault = this.$slots.default;
        for (let i = 0; i < slotDefault.length; i++) {
            let item = slotDefault[i];
            let comp = item.componentInstance;
            if (!comp) {
                continue;
            }
            this.items.push({
                label: comp.label,
                active: false,
                comp: comp
            });
        }
        this.items[0].active = true;
        this.items[0].comp.visible = true;
    },
    updated() {

    },
    methods: {
        chooseTab(item) {
            this.items.forEach(item => {
                item.active = false;
                item.comp.visible = false;
            });
            this.activeTab(item);
        },
        activeTab(item) {
            item.active = true;
            item.comp.visible = true;
        }
    }
}
module.exports.template = "<div class=\"jxia-tabs\">\r\n    <div class=\"jxia-tabs-head\">\r\n        <div class=\"jxia-tabs-head-item\" @click=\"chooseTab(item)\" v-for=\"(item,index) in items\" :key=\"index\" :class=\"{active: item.active }\">\r\n            {{item.label}}\r\n        </div>\r\n    </div>\r\n    <div>\r\n        <slot></slot>\r\n    </div>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-tabs-item',
    props: ['label'],
    data() {
        return {
            visible: false
        }
    },
    mounted() {}
}
module.exports.template = "<div v-if=\"visible\">\r\n    <slot></slot>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-datagrid',
    render(h) {

        let domTree = {
            tag: 'div'
        };

        append(domTree, this.$slots.default);

        let table = {
            tag: 'table'
        }

        append(domTree, table);

        let thead = {
            tag: 'tr'
        }

        append(table, thead);

        for (let i = 0; i < this.cols.length; i++) {
            let col = this.cols[i];
            let th = {
                tag: 'th',
                children: [col.label]
            }
            append(thead, th);
        }

        let tbody = {
            tag: 'tbody'
        }

        append(table, tbody);

        for (let i = 0; i < this.rows.length; i++) {
            let row = this.rows[i];
            let tr = {
                tag: 'tr'
            };
            for (let j = 0; j < this.cols.length; j++) {
                let col = this.cols[j];
                let content;
                if (col.renderCell) {
                    content = col.renderCell(h, row);
                } else {
                    content = row[col.field];
                }
                let td = {
                    tag: 'td',
                    children: [content]
                }
                append(tr, td);
            }
            append(tbody, tr);
        }



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
                        return;
                    }
                    if (isVNode(child) || typeof child === "string") {
                        children.push(child);
                    } else {
                        children.push(createDom(child));
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

            console.log(children);
        }

        function isVNode(el) {
            if (el && el.constructor && el.constructor.name === "VNode") {
                return true;
            }
            return false;
        }
    },
    props: ["dataset"],
    data() {
        return {
            cols: [],
            rows: []
        }
    },
    mounted() {
        if (this.dataset) {
            this.rows = this.dataset.rows;
        }
    },
    updated() {

    },
    methods: {
        pushInColumn(col) {
            this.cols.push(col);
        },
        setRows(rows) {
            this.rows = rows;
        }
    },
    watch: {
        dataset: {
            handler() {
                if (this.dataset) {
                    this.rows = this.dataset.rows;
                }
            },
            deep: true
        }
    },
}
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-datagrid-item',
    props: ['label', 'field'],
    data() {
        return {}
    },
    mounted() {
        let col = {
            label: this.label,
            field: this.field
        };
        if (this.$scopedSlots.default) {
            let renderer = this.$scopedSlots.default;
            col.renderCell = function(h, data) {
                return h("div", {
                    attrs: {
                        "class": "table-cell"
                    }
                }, [renderer(data)])
            }
        }
        this.$parent.cols.push(col);
    },
    updated() {},
    methods: {}
}
module.exports.template = "<div v-if=\"false\">\r\n    <slot></slot>\r\n</div>"
return module.exports;})(), 

)
