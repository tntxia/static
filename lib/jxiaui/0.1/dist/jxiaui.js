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

        let me = this;

        let domTree = {
            tag: 'div',
            options: {
                'class': 'jxiaui-datagrid'
            }
        };

        append(domTree, this.$slots.default);

        if (this.loading) {
            let loadingDiv = {
                tag: 'div'
            }
            append(domTree, loadingDiv);

            let loadingSpan = {
                tag: 'span',
                options: {
                    'class': 'fa fa-spin fa-spinner'
                }
            }
            append(loadingDiv, loadingSpan);
        }

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
                } else if (col.type) {
                    if (col.type === 'index') {
                        content = i + 1;
                    }
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

        let pagingDiv = {
            tag: 'div'
        }

        let prevBtn = {
            tag: 'button',
            options: {
                on: {
                    click() {
                        me.page--;
                        me.loadData();
                    }
                }
            },
            children: ["上一页"]
        }

        append(pagingDiv, prevBtn);

        let nextBtn = {
            tag: 'button',
            options: {
                on: {
                    click() {
                        me.page++;
                        me.loadData();
                    }
                }
            },
            children: ["下一页"]
        }

        append(pagingDiv, nextBtn);

        append(domTree, pagingDiv);

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
    props: ["dataset"],
    data() {
        return {
            loading: false,
            url: null,
            method: 'get',
            params: null,
            cols: [],
            rows: [],
            page: 1,
            pageSize: 10,
            total: 0
        }
    },
    mounted() {
        let dataset = this.dataset;
        if (dataset) {
            let rows = dataset.rows;
            if (rows) {
                this.rows = dataset.rows;
            }
            let url = dataset.url;
            let me = this;
            if (url) {
                this.url = url;
                if (dataset.method) {
                    this.method = dataset.method;
                }
                let params = {};
                if (dataset.params) {
                    params = dataset.params;
                }
                if (dataset.pageSize) {
                    this.pageSize = dataset.pageSize
                }
                this.params = params;
                this.loadData();
            }

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
        },
        setParams(params) {
            this.params = params;
        },
        loadData() {
            let me = this;
            let url = this.url;
            let params = this.params;
            if (!params) {
                params = {};
            }
            params.page = this.page;
            params.pageSize = this.pageSize;
            this.loading = true;
            $.ajax({
                url: url,
                data: params,
                type: this.method
            }).done(res => {
                me.loading = false;
                me.rows = res.rows;
                me.total = res.total;
            }).fail(e => {
                me.loading = false;
            })
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
    props: ['label', 'field', 'type'],
    data() {
        return {}
    },
    mounted() {
        let col = {
            label: this.label,
            field: this.field,
            type: this.type
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


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-datepicker',
    props: {
        value: {}
    },
    data() {
        return {
            inputText: null,
            showFlag: false,
            year: null,
            month: null,
            dateArr: []
        }
    },
    mounted() {
        let now = new Date();
        let year = now.getFullYear();
        this.year = year;
        let month = now.getMonth();
        this.month = month;
        this.initDate();
    },
    methods: {
        emptyFun() {},
        initDate() {
            let year = this.year;
            let month = this.month;
            let firstDateOfMonth = getFirstDateOfMonth(year, month);
            let day = firstDateOfMonth.getDay();
            let gap = -day;
            this.dateArr = [];
            let dRow = [];
            this.dateArr.push(dRow);
            for (i = gap; i < 42 + gap; i++) {
                let d = new Date(year, month, i + 1);
                let m = d.getMonth();
                let date = d.getDate();
                if (dRow.length >= 7) {
                    dRow = [];
                    this.dateArr.push(dRow);
                }
                dRow.push({
                    label: d.getDate(),
                    isToday: isToday(year, m, date),
                    isCurrentMonth: m == month,
                    source: d
                });
            }
        },
        showCalendar() {
            let me = this;
            this.showFlag = true;
            document.addEventListener("click", hideCalendar, false);

            function hideCalendar() {
                me.showFlag = false;
                document.removeEventListener("click", hideCalendar, false);
            }
            console.log("show the calendar");
        },
        choose(d) {
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let date = d.getDate();
            if (date < 10) {
                date = "0" + date;
            }

            this.inputText = year + "-" + month + "-" + date;
            this.showFlag = false;
            this.$emit("input", this.inputText);
            console.log("choose date,,,,,", this.inputText);
        },
        preYear() {
            this.year--;
            this.initDate();
        },
        preMonth() {
            this.month--;
            this.initDate();
        },
        nextMonth() {
            this.month++;
            this.initDate();
        },
        nextYear() {
            this.year++;
            this.initDate();
        }
    }
}

function getFirstDateOfMonth(year, month) {
    return new Date(year, month, 1);
}

function isToday(year, month, date) {
    let now = new Date();
    console.log("check today ,", now.getMonth(), year, month, date);
    return now.getFullYear() == year && now.getMonth() == month && now.getDate() == date;
}

function isThisMonth(d) {
    let year = d.getFullYear();
    let month = d.getMonth();

    let now = new Date();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth();
    return year == nowYear && month == nowMonth;

}
module.exports.template = "<div class=\"jxia-ui-datepicker\">\r\n    <input v-model=\"inputText\" readonly=\"readonly\" @click.stop=\"showCalendar\">\r\n    <span class=\"fa fa-calendar\" @click.stop=\"showCalendar\"></span>\r\n    <div class=\"datepicker-calendar\" v-if=\"showFlag\" @click.stop=\"emptyFun\">\r\n        <div class=\"datepicker-head\">\r\n            <span class=\"fa fa-angle-double-left operate-btn\" @click.stop=\"preYear\"></span>\r\n            <span class=\"fa fa-angle-left operate-btn\" @click.stop=\"preMonth\"></span>\r\n            <span>{{year}} 年 {{month + 1}} 月</span>\r\n            <span class=\"fa fa-angle-right operate-btn\" @click.stop=\"nextMonth\"></span>\r\n            <span class=\"fa fa-angle-double-right operate-btn\" @click.stop=\"nextYear\"></span>\r\n        </div>\r\n        <div>\r\n            <table>\r\n                <thead>\r\n                    <tr>\r\n                        <th>日</th>\r\n                        <th>一</th>\r\n                        <th>二</th>\r\n                        <th>三</th>\r\n                        <th>四</th>\r\n                        <th>五</th>\r\n                        <th>六</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr v-for=\"row in dateArr\">\r\n                        <td v-for=\"d in row\" @click=\"choose(d.source)\" class=\"date-block\" :class=\"{'is-today':d.isToday, 'is-this-month': d.isCurrentMonth}\">\r\n                            {{d.label}}</td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n        </div>\r\n    </div>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-dialog',
    props: ["title"],
    data() {
        return {
            maxHeight: null
        }
    },
    mounted() {
        let bodyHeight = document.body.clientHeight;
        this.maxHeight = bodyHeight - 80;
    },
    updated() {},
    methods: {
        close() {
            debugger
            this.$emit("close");
        }
    }
}
module.exports.template = "<div class=\"jxiaui-dialog-wrapper\">\r\n    <div class=\"jxiaui-dialog-box\" style=\"width: 500px;\" :style=\"{'max-height': maxHeight + 'px'}\">\r\n        <div class=\"jxiaui-dialog-title\" style=\"position: relative;\">\r\n            &nbsp;\r\n            <span>{{title}}</span>\r\n            <span class=\"fa fa-close\" style=\"position: absolute;right: 10px;cursor: pointer;\" @click=\"close\"></span>\r\n        </div>\r\n        <div>\r\n            <slot>\r\n            </slot>\r\n        </div>\r\n    </div>\r\n</div>"
return module.exports;})(), 

)
