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
        items.forEach(item => {
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
                            items.forEach(item => {
                                item.active = false;
                            })
                            item.active = true;
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

        items.forEach(item => {
            let display;
            if (item.active) {
                display = ""
            } else {
                display = "none"
            }
            let content = item.content;
            let children = [];
            if (isArray(content)) {
                content.forEach(c => {
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
    if (!val) {
        return false;
    }
    return typeof val.length === "number"
}
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
    mounted() {
        let slots = this.$slots;
        this.$parent.tabJoinIn({
            label: this.label,
            content: slots.default
        });
    }
}
module.exports.template = "<div v-if=\"visible\">\r\n    <slot></slot>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-pagination',
    props: ['page', 'pageSize', 'total'],
    data() {
        return {
            firstPageShowFlag: false,
            lastPageShowFlag: false,
            pageList: [],
            pageSizeList: [5, 10, 20, 50, 100],
            totalPage: 0,
            paging: {
                page: 1,
                pageSize: 10
            },
            visible: false
        }
    },
    mounted() {
        this.paging.page = this.page;
        this.paging.pageSize = this.pageSize;
        this.init();
    },
    methods: {
        init() {
            let page = this.paging.page;
            let total = this.total;
            let pageSize = this.paging.pageSize;
            this.paging.pageSize = pageSize;
            let totalPage = total % pageSize === 0 ? total / pageSize : Math.ceil(total / pageSize);
            this.totalPage = totalPage;
            this.pageList = [];
            let pageListMaxSize = 3;
            let pageListStartPage = page - Math.floor(pageListMaxSize / 2);
            if (pageListStartPage < 1) {
                pageListStartPage = 1;
            }
            let pageListEndPage = pageListStartPage + pageListMaxSize - 1;
            if (pageListEndPage > totalPage) {
                pageListEndPage = totalPage;
                pageListStartPage = pageListEndPage - pageListMaxSize + 1;
                if (pageListStartPage < 1) {
                    pageListStartPage = 1;
                }
            }
            for (let i = pageListStartPage; i <= pageListEndPage; i++) {
                this.pageList.push(i);
            }
            if (this.pageList.indexOf(1) == -1) {
                this.firstPageShowFlag = true;
            } else {
                this.firstPageShowFlag = false;
            }
            if (this.pageList.indexOf(totalPage) == -1) {
                this.lastPageShowFlag = true;
            } else {
                this.lastPageShowFlag = false;
            }

        },
        choose(page) {
            this.paging.page = page;
            this.$emit("page-change", page);
            this.init();
        },
        pageSizeChange() {
            this.paging.page = 1;
            this.$emit("page-size-change", this.paging.pageSize);
            this.init();
        }
    },
    watch: {
        total() {
            this.paging.total = this.total;
            this.init();
        },
        pageSize() {
            this.paging.pageSize = this.pageSize;
            if (this.pageSizeList.indexOf(this.pageSize) === -1) {
                this.pageSizeList.push(this.pageSize);
                this.pageSizeList = this.pageSizeList.map(item => parseInt(item)).sort((a, b) => {
                    if (a > b) {
                        return 1;
                    } else if (a < b) {
                        return -1
                    } else {
                        return 0;
                    }
                });
            }
            this.init();
        }
    },
}
module.exports.template = "<div class=\"jxiaui-pagination\">\r\n    共有{{total}}条记录，共{{totalPage}}页，每页\r\n    <select v-model=\"paging.pageSize\" @change=\"pageSizeChange\">\r\n        <option v-for=\"p in pageSizeList\" :value=\"p\">{{p}}</option>\r\n    </select> 条\r\n    <div style=\"display: inline-block\" v-if=\"total > 0\">\r\n        <span class=\"fa fa-angle-double-left jxiaui-pagination-paging-button\"></span>\r\n        <span v-if=\"firstPageShowFlag\" class=\"jxiaui-pagination-first-page  jxiaui-pagination-paging-button\" @click=\"choose(1)\">1</span>\r\n        <span v-if=\"firstPageShowFlag\">...</span>\r\n        <span v-for=\"p in pageList\" :class=\"{selected: p === paging.page}\" class=\" jxiaui-pagination-paging-button\" @click=\"choose(p)\">{{p}}</span>\r\n        <span v-if=\"lastPageShowFlag\">...</span>\r\n        <span v-if=\"lastPageShowFlag\" class=\"jxiaui-pagination-first-page  jxiaui-pagination-paging-button\" @click=\"choose(totalPage)\">{{totalPage}}</span>\r\n        <span class=\"fa fa-angle-double-right jxiaui-pagination-paging-button\"></span>\r\n    </div>\r\n\r\n</div>"
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

        if (this.check) {
            let checkTh = {
                tag: 'th'
            }
            append(thead, checkTh);
            let checkbox = {
                tag: 'span',
                options: {
                    'class': this.checkedAll ? 'fa fa-check-square' : 'fa fa-square-o',
                    on: {
                        click(e) {
                            me.checkedAll = !me.checkedAll;
                            me.rows.forEach(row => {
                                row.checked = me.checkedAll;
                            });
                            me.$emit("checked-change");
                        }
                    }
                }
            };
            append(checkTh, checkbox);
        }

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
                tag: 'tr',
                options: {
                    'class': row.selected ? 'selected' : '',
                    on: {
                        click(e) {
                            row.selected = !row.selected;
                        }
                    }
                }
            };

            if (this.check) {
                let td = {
                    tag: 'td'
                }
                append(tr, td);

                let checkbox = {
                    tag: 'span',
                    options: {
                        'class': row.checked ? 'fa fa-check-square' : 'fa fa-square-o',
                        on: {
                            click(e) {
                                e.preventDefault();
                                row.checked = !row.checked;
                            }
                        }
                    }
                }
                append(td, checkbox);
            }

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

        if (this.paginationShowFlag) {
            let pagingDiv = {
                tag: 'jxiaui-pagination',
                options: {
                    props: {
                        page: 1,
                        pageSize: me.pageSize,
                        total: me.total
                    },
                    on: {
                        "page-change": function(page) {
                            me.page = page;
                            me.loadData();
                        },
                        "page-size-change": function(pageSize) {
                            me.page = 1;
                            me.pageSize = pageSize;
                            me.loadData();
                        }
                    }
                }
            }

            append(domTree, pagingDiv);
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
    props: {
        dataset: {},
        check: {},
        loadDataWhenInit: {
            default: true
        },
        selfDefineRowHandler: {}
    },
    data() {
        return {
            loading: false,
            checkedAll: false,
            url: null,
            method: 'get',
            cols: [],
            rows: [],
            newRows: [],
            paginationShowFlag: true,
            page: 1,
            pageSize: 10,
            total: 0,
            rowHandlers: []
        }
    },
    mounted() {
        if (this.check === true) {
            this.rowHandlers.push(checkGridRowHandler);
        }
        let selfDefineRowHandler = this.selfDefineRowHandler;
        if (selfDefineRowHandler) {
            this.rowHandlers.push(selfDefineRowHandler);
        }
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
                if (dataset.pageSize) {
                    this.pageSize = dataset.pageSize
                }
                // 是否在初始化时加载数据
                if (this.loadDataWhenInit) {
                    this.loadData();
                }

            }

        }
    },
    updated() {

    },
    methods: {
        pushInColumn(col) {
            this.cols.push(col);
        },
        insertRow(row) {
            if (!row) {
                row = {};
            }
            row.isNew = true;
            this.newRows.push(row);
            this.rows.unshift(row);
        },
        addRow(row) {
            if (!row) {
                row = {};
            }
            row.isNew = true;
            this.newRows.push(row);
            this.rows.push(row);
        },
        setRows(rows) {
            this.rows = rows;
        },
        getRows() {
            return this.rows;
        },
        getNewRows() {
            return this.newRows;
        },
        getSelectedRows() {
            return this.rows.filter(row => row.checked);
        },
        unselectAll() {
            this.rows.forEach(row => {
                row.checked = false;
            });
        },
        setParams(params) {
            this.params = params;
        },
        loadData(queryParam) {
            let me = this;
            let url = this.url;
            let params = this.params;
            if (!params) {
                params = {};
            }
            if (this.dataset.params) {
                extend(params, this.dataset.params);
            }
            if (queryParam) {
                extend(params, queryParam);
            }
            params.page = this.page;
            params.pageSize = this.pageSize;
            this.loading = true;
            $.ajax({
                url: url,
                data: params,
                type: this.method
            }).done(res => {
                if (res.data) {
                    res = res.data;
                }
                let rows;
                if ($.isArray(res)) {
                    rows = res;
                    me.paginationShowFlag = false;
                } else {
                    rows = res.rows;
                    me.paginationShowFlag = true;
                }
                let rowHandlers = me.rowHandlers;
                rows.forEach(row => {
                    rowHandlers.forEach(h => {
                        h(row);
                    });
                    row.isNew = false;
                })

                me.loading = false;
                me.rows = rows;
                me.total = res.totalAmount;
            }).fail(e => {
                me.loading = false;
            })
        },
        query(params) {
            if (this.check) {
                this.rows.forEach(row => {
                    row.checked = false;
                })
            }
            this.page = 1;
            this.loadData(params);
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
        },
        rows: {
            deep: true,
            handler() {
                this.$emit("change", this.rows);
            }
        }
    },
}

function extend(target, source) {
    if (!source) {
        return;
    }
    for (let k in source) {
        target[k] = source[k];
    }
}

// 勾选类型的数据表格的行处理函数
function checkGridRowHandler(row) {
    row.checked = false;
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
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 

Date.prototype.format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = {
    name: 'jxiaui-datepicker',
    props: {
        value: {},
        format: {
            default: 'yyyy-MM-dd'
        },
        default: {}
    },
    data() {
        return {
            inputText: null,
            showFlag: false,
            year: null,
            yearEditing: false,
            month: null,
            dateArr: []
        }
    },
    mounted() {
        let now = new Date();
        if (this.default === 'now') {
            this.inputText = now.format(this.format);
        }
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
        },
        startEditYear() {
            this.yearEditing = true;
        },
        endEditYear() {
            this.yearEditing = false;
        },
        choose(d) {
            this.inputText = d.format(this.format);
            this.showFlag = false;
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
    },
    watch: {
        inputText() {
            this.$emit("input", this.inputText);
        }
    },
}

function getFirstDateOfMonth(year, month) {
    return new Date(year, month, 1);
}

function isToday(year, month, date) {
    let now = new Date();
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
module.exports.template = "<div class=\"jxia-ui-datepicker\">\r\n    <input v-model=\"inputText\" readonly=\"readonly\" @click.stop=\"showCalendar\" @keyup.delete=\"inputText=null\">\r\n    <span class=\"fa fa-calendar\" @click.stop=\"showCalendar\"></span>\r\n    <div class=\"datepicker-calendar\" v-if=\"showFlag\" @click.stop=\"endEditYear\">\r\n        <div class=\"datepicker-head\">\r\n            <span class=\"fa fa-angle-double-left operate-btn\" @click.stop=\"preYear\"></span>\r\n            <span class=\"fa fa-angle-left operate-btn\" @click.stop=\"preMonth\"></span>\r\n            <span v-if=\"!yearEditing\" @click.stop=\"startEditYear\">{{year}} 年</span>\r\n            <span v-if=\"yearEditing\">\r\n                <input v-model=\"year\" @click.stop=\"emptyFun\" size=\"4\"> 年\r\n            </span>\r\n\r\n            <span>{{month + 1}} 月</span>\r\n            <span class=\"fa fa-angle-right operate-btn\" @click.stop=\"nextMonth\"></span>\r\n            <span class=\"fa fa-angle-double-right operate-btn\" @click.stop=\"nextYear\"></span>\r\n        </div>\r\n        <div>\r\n            <table>\r\n                <thead>\r\n                    <tr>\r\n                        <th>日</th>\r\n                        <th>一</th>\r\n                        <th>二</th>\r\n                        <th>三</th>\r\n                        <th>四</th>\r\n                        <th>五</th>\r\n                        <th>六</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr v-for=\"row in dateArr\">\r\n                        <td v-for=\"d in row\" @click=\"choose(d.source)\" class=\"date-block\" :class=\"{'is-today':d.isToday, 'is-this-month': d.isCurrentMonth}\">\r\n                            {{d.label}}</td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n        </div>\r\n    </div>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-dialog',
    props: {
        title: {},
        width: {
            default: 500
        }
    },
    data() {
        return {
            maxHeight: null,
            showFlag: false
        }
    },
    mounted() {

    },
    updated() {},
    methods: {
        show() {
            this.showFlag = true;
            this.$nextTick(function() {
                this.adapt();
            });
        },
        adapt() {
            let box = this.$refs["dialogBox"];
            let bodyWidth = document.body.clientWidth;
            let bodyHeight = document.body.clientHeight;
            let width = box.clientWidth;
            box.style.left = (bodyWidth - width) / 2 + "px";

            let content = box.querySelector(".jxiaui-dialog-box-content");
            content.style["max-height"] = (bodyHeight * 0.7 - 30) + "px";
            console.log("body width", bodyWidth);

            console.log("box width", width);
        },
        close() {
            this.showFlag = false;
            this.$emit("close");
        }
    }
}
module.exports.template = "<div class=\"jxiaui-dialog-wrapper\" v-if=\"showFlag\">\r\n    <div ref=\"dialogBox\" class=\"jxiaui-dialog-box\" :style=\"{'max-height': maxHeight + 'px',width: width + 'px'}\">\r\n        <div class=\"jxiaui-dialog-title\" style=\"position: relative;\">\r\n            &nbsp;\r\n            <span>{{title}}</span>\r\n            <span class=\"fa fa-close\" style=\"position: absolute;right: 10px;cursor: pointer;\" @click=\"close\"></span>\r\n        </div>\r\n        <div class=\"jxiaui-dialog-box-content\">\r\n            <slot>\r\n            </slot>\r\n        </div>\r\n    </div>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-ip-input',
    props: ['value', 'disabled'],
    data() {
        return {
            // ip v4
            segs: [{
                value: null
            }, {
                value: null
            }, {
                value: null
            }, {
                value: null
            }]
        }
    },
    mounted() {
        this.handleValue();
    },
    updated() {},
    methods: {
        handleValue() {
            let value = this.value;
            if (!value) {
                this.v = null;
                this.$emit("input", null);
                return;
            }
            this.segs = this.value.split(".").map(item => { return { "value": item } });
        },
        handleChange() {
            let segList = this.segs.map(item => item.value);
            this.$emit("input", segList.join("."))
        }
    },
    watch: {
        value() {
            this.handleValue();
        }
    }
}
module.exports.template = "<div class=\"jxiaui-ip-input\">\r\n    <template v-for=\"(seg, index) in segs\">\r\n        <input v-model=\"seg.value\" maxlength=\"3\" @change=\"handleChange\" :disabled=\"disabled\">\r\n        <span v-if=\"index !== segs.length - 1\">.</span>\r\n    </template>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-checkbox',
    props: ['value', 'trueValue', 'falseValue'],
    data() {
        return {
            v: null
        }
    },
    mounted() {
        this.handleValue();
    },
    updated() {},
    methods: {
        handleValue() {
            let value = this.value;
            let trueValue = this.trueValue;
            let falseValue = this.falseValue;
            if (trueValue) {
                if (value === trueValue) {
                    this.v = true;
                }
            }
            if (falseValue) {
                if (value === falseValue) {
                    this.v = false;
                }
            }
            if (this.v === null) {
                this.v = false;
            }
        },
        handleChange() {
            let v = this.v;
            let value;
            let trueValue = this.trueValue;
            let falseValue = this.falseValue;
            if (trueValue) {
                if (v) {
                    value = trueValue;
                }
            }
            if (falseValue) {
                if (!v) {
                    value = falseValue;
                }
            }
            this.$emit("input", value);
        }
    },
    watch: {
        v() {
            if (this.v) {
                this.$emit("input", this.trueValue);
            } else {
                this.$emit("input", this.falseValue);
            }
        },
        value() {
            this.handleValue();
        }
    },
}
module.exports.template = "<input v-model=\"v\" type=\"checkbox\" @change=\"handleChange\">"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-button',
    props: ['loading', 'icon'],
    data() {
        return {
            v: null,
            props: {
                disabled: false
            }
        }
    },
    mounted() {},
    updated() {},
    methods: {
        handleClick() {
            this.props.disabled = true;
            setTimeout(() => {
                this.props.disabled = false;
            }, 2000);
            this.$emit("click");
        }
    },
    computed: {
        prevIcon() {
            if (this.loading) {
                return 'fa fa-spin fa-spinner'
            }
            if (!this.icon) {
                return null;
            }
            return 'fa fa-' + this.icon;
        }
    }
}
module.exports.template = "<button class=\"jxiaui-button\" :disabled=\"props.disabled\" @click=\"handleClick\">\r\n    <span :class=\"prevIcon\"></span>\r\n    <slot></slot>\r\n</button>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-combobox',
    props: {
        value: {},
        dataset: {},
        width: {},
        paramField: {
            default: 'name'
        }
    },
    data() {
        return {
            showFlag: false,
            lastSearchText: null,
            searchText: null,
            params: {},
            choosed: null,
            list: [],
            field: 'name',
            label: 'name'
        }
    },
    mounted() {
        if (this.dataset.field) {
            this.field = this.dataset.field;
        }
        if (this.dataset.label) {
            this.label = this.dataset.label;
        }
        this.loadData();
    },
    updated() {},
    methods: {
        loadData(params) {
            return new Promise((resolve, reject) => {
                let me = this;
                $.ajax({
                    url: this.dataset.url,
                    type: 'post',
                    data: params
                }).done(res => {
                    let list;
                    if ($.isArray(res)) {
                        list = res;
                    } else {
                        list = res.rows;
                    }
                    me.list = list;
                    resolve(list);
                })
            });
        },
        handleChange() {

        },
        handleKeyup() {
            console.log("keyup happen,", this.searchText);
            if (this.searchText != this.lastSearchText) {
                this.lastSearchText = this.searchText;
                let paramField = this.paramField;
                let param = {};
                param[paramField] = this.searchText;
                this.loadData(param).then(list => {
                    // 如果查询结果只有一个，而且和输入完全吻合，直接作为选择项
                    if (list && list.length === 1 && list[0][me.label] === this.searchText) {
                        this.choosed = list[0];
                    }
                    this.showFlag = true;
                });
            }
        },
        choose(item) {
            this.searchText = item[this.field];
            this.choosed = item;
            this.showFlag = false;
        },
        handleClick() {
            this.showFlag = !this.showFlag;
        }
    },
    watch: {
        choosed() {
            let choosed = this.choosed;
            this.$emit("change", this.choosed);
            if (!choosed) {
                this.$emit("input", null);
                return;
            }
            this.$emit("input", choosed[this.field]);
        }
    },
}
module.exports.template = "<div class=\"jxiaui-combobox\">\r\n    <input ref=\"inputBox\" v-model=\"searchText\" @change=\"handleChange\" @keyup.stop=\"handleKeyup\" @click=\"handleClick\">\r\n    <div class=\"combobox-dropdown-list\" v-if=\"showFlag\">\r\n        <div v-for=\"item in list\" @click.stop=\"choose(item)\">{{item[label]}}</div>\r\n    </div>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
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
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-table-form-item',
    props: ['label', 'colspan'],
    data() {
        return {
            visible: false
        }
    },
    mounted() {
        let item = {
            label: this.label,
            colspan: this.colspan
        }
        if (this.$scopedSlots.default) {
            let renderer = this.$scopedSlots.default;
            item.render = function(h, data) {
                return h("div", {
                    attrs: {
                        "class": "table-form-item-content"
                    }
                }, [renderer(data)])
            }
        }
        this.$parent.items.push(item);
    }
}
module.exports.template = "<div v-if=\"visible\">\r\n    <slot></slot>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-select',
    props: ['url', 'labelName', 'valueName'],
    data() {
        return {
            v: null,
            list: []
        }
    },
    mounted() {
        this.$http.get(this.url).then(res => {
            let data = res.body;
            if (data.data) {
                data = data.data;
            }
            if (data.rows) {
                data = data.rows;
            }
            let list = [];
            let labelName = this.labelName;
            let valueName = this.valueName;
            data.forEach(item => {
                list.push({
                    label: item[labelName],
                    value: item[valueName]
                })
            })
            this.list = list;
            if (this.value) {
                this.v = this.value;
            } else {
                if (list && list.length) {
                    this.v = list[0].value;
                }
            }
        });

    },
    methods: {
        handleChange() {
            let segList = this.segs.map(item => item.value);
            this.$emit("input", segList.join("."))
        }
    },
    watch: {
        v() {
            this.$emit("input", this.v);
        }
    }
}
module.exports.template = "<div>\r\n    <select v-model=\"v\">\r\n        <option v-for=\"item in list\" :value=\"item.value\">{{item.label}}</option>\r\n    </select>\r\n</div>\r\n"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-radio-group',
    props: ['value'],
    data() {
        return {
            v: null,
            items: []
        }
    },
    mounted() {},
    methods: {},
    watch: {
        v() {
            debugger
            this.$emit("input", this.v);
        }
    }
}
module.exports.template = "<div class=\"jxiaui-radio-group\">\r\n    <div class=\"jxiaui-radio-group-item\" v-for=\"(item,index) in items\" :key=\"index\">\r\n        <input type=\"radio\" v-model=\"v\" :value=\"item.value\"> <label>{{item.label}}</label>\r\n    </div>\r\n    <slot></slot>\r\n    <!--\r\n    5- 极好<input type=\"radio\" name=\"rfq\" value=\"5\"> 4- 好 <input type=\"radio\" name=\"rfq\" value=\"4\"> 3- 一般<input type=\"radio\" name=\"rfq\" value=\"3\"> 2- 差 <input type=\"radio\" name=\"rfq\" value=\"2\"> 1- 极差<input type=\"radio\" name=\"rfq\" value=\"1\"></input>-->\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-radio-group-item',
    props: ['label', 'value'],
    data() {
        return {}
    },
    mounted() {
        this.$parent.items.push({
            label: this.label,
            value: this.value
        })
    },
    methods: {},
    watch: {}
}
module.exports.template = "<div v-if=\"false\">\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
let echartInstance;
module.exports = {
    name: 'jxiaui-echart',
    props: ['option'],
    data() {
        return {}
    },
    mounted() {
        let el = this.$refs["echartcontainer"];
        echartInstance = echarts.init(el);
        this.initOption();
    },
    updated() {},
    methods: {
        initOption() {
            echartInstance.setOption(this.option);
        }
    },
    watch: {
        option() {
            this.initOption();
        }
    }
}
module.exports.template = "<div ref=\"echartcontainer\" style=\"height: 500px;\">\r\n\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-upload-image',
    props: ['src'],
    data() {
        return {
            picSrc: null
        }
    },
    mounted() {
        let me = this;
        if (this.src) {
            this.picSrc = this.src;
        } else {
            this.picSrc = '/static/images/no-pic.png';
        }
        let fileInput = this.$refs["fileInput"];
        let pic = this.$refs["pic"];
        pic.addEventListener("click", function() {
            fileInput.click();
        });
        fileInput.addEventListener("change", function(e) {
            let file = me.getFile();
            var URL = window.URL || window.webkitURL;
            var result = URL.createObjectURL(file);
            pic.src = result;
        });
    },
    methods: {
        getFile() {
            let fileInput = this.$refs["fileInput"];
            let files = fileInput.files;
            if (!files || !files.length) {
                return null;
            }
            let file = files[0];
            return file;
        }
    },
    watch: {
        src() {
            this.picSrc = this.src;
        }
    }
}
module.exports.template = "<div class=\"jxiaui-upload-image\">\r\n    <img :src=\"picSrc\" ref=\"pic\">\r\n    <input type=\"file\" ref=\"fileInput\">\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-tree',
    props: ['data'],
    render: function(h) {

        let treeData = copy(this.treeData);

        let treeNodeRender = this.$scopedSlots.default;

        let domTree = {
            tag: 'div',
            options: {
                'class': 'jxiaui-tree'
            }
        };

        let rootNodesData = [];

        if (treeData) {
            let i = 0;
            while (i < treeData.length) {
                let treeNodeData = treeData[i];
                if (!treeNodeData.pid) {
                    rootNodesData.push(treeNodeData);
                    treeData.splice(i, 1);
                } else {
                    i++;
                }
            }
        }


        rootNodesData.forEach(root => {
            createNode(domTree, root);
        });

        return createDom(domTree);

        function copy(arr) {
            if (!arr) {
                return arr;
            }
            let res = [];
            arr.forEach(item => {
                res.push(item);
            })
            return res;
        }

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

        function createNode(parent, nodeData) {

            let div = {
                id: nodeData.id,
                tag: 'div'
            }

            let content = treeNodeRender(nodeData);
            let children = [];
            if (content.length) {
                children = content;
            } else {
                children = [content];
            }
            let textDiv = {
                tag: 'div',
                children: children
            }
            append(div, textDiv);

            if (isDomTree(parent)) {
                append(parent, div);
            } else {
                // 用来放子结点的Div
                let childrenDiv;
                if (parent.children && parent.children.length && parent.children.length > 1) {
                    childrenDiv = parent.children[1];
                } else {
                    childrenDiv = {
                        tag: 'div',
                        options: {
                            'class': 'children-container'
                        }
                    }
                    append(parent, childrenDiv);
                }
                append(childrenDiv, div);
            }

            let childrenData = [];
            treeData.forEach(treeNodeData => {
                if (treeNodeData.pid == nodeData.id) {
                    childrenData.push(treeNodeData);
                }
            });

            childrenData.forEach(childData => {
                createNode(div, childData);
            });

            return div;
        }

        function isDomTree(node) {
            return node && node.options && node.options.class === 'jxiaui-tree';
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
            treeData: []
        }
    },
    mounted() {
        this.treeData = this.data;
    },
    methods: {
        getFile() {
            let fileInput = this.$refs["fileInput"];
            let files = fileInput.files;
            if (!files || !files.length) {
                return null;
            }
            let file = files[0];
            return file;
        }
    },
    watch: {
        data() {
            this.treeData = this.data;
        }
    }
}
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-rich-editor',
    props: ['value', 'height'],
    data() {
        return {
            img: null,
            color: 'rgb(0, 0, 0)',
            palette: {
                showFlag: false,
                grid: [
                    ['255,206,45', '98,147,187', '167,212,60'],
                    ['23,206,142', '95,147,187', '41,212,60'],
                    ['178,20,142', '195,47,120', '41,20,60'],
                ],
                red: 0,
                green: 0,
                blue: 0
            }
        }
    },
    mounted() {
        let me = this;
        let value = this.value;
        let iframe = this.$refs.iframe;
        var contentWindow = iframe.contentWindow;
        let document = contentWindow.document;
        document.designMode = "on";
        document.contentEditable = true;
        //但是IE与FireFox有点不同，为了兼容FireFox，所以必须创建一个新的document。
        document.open();
        document.writeln('<html><head></head><body></body></html>');
        document.close();

        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.innerHTML = ".selected{border:2px solid blue}";
        style.type = 'text/css';
        head.appendChild(style);

        document.addEventListener("keyup", function() {
            let content = contentWindow.document.body.innerHTML;
            me.$emit("input", content)
            console.log(content);
        }, false);
        document.addEventListener("click", function(e) {
            let imgs = document.querySelectorAll("img");
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].className = "";
            }
            let target = e.target;
            if (target.tagName === "IMG") {
                target.className = "selected";
                me.img = {
                    width: target.width,
                    height: target.height
                };
                contentWindow.selectedImg = target;
            } else {
                me.img = null;
            }
            console.log(e);
        }, false);
        this.setHTML(value);
    },
    methods: {
        getStyle() {
            let style = {};
            if (this.height) {
                style.height = this.height + "px";
            }
            return style;
        },
        togglePalette() {
            this.palette.showFlag = true;
        },
        hidePalette() {
            this.palette.showFlag = false;
        },
        chooseColor(rgb) {
            let sp = rgb.split(",");
            this.palette.red = parseInt(sp[0]);
            this.palette.green = parseInt(sp[1]);
            this.palette.blue = parseInt(sp[2]);
        },
        changeColor() {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            var doc = contentWindow.document;
            console.log("execute forecolor", this.color);
            doc.execCommand('forecolor', false, this.color);
        },
        insertPic() {
            this.$refs.picFile.click();
        },
        uploadPic() {
            let me = this;
            let file = this.$refs.picFile.files[0];
            let param = new FormData(); // 创建form对象
            param.append('file', file); //对应后台接收图片名
            $.ajax({
                type: "POST",
                data: param,
                url: '/file_center/file!upload.do',
                contentType: false,
                processData: false,
            }).success(function(data) {
                let img = document.createElement("img");
                img.src = "/file_center/file!showPic.do?uuid=" + data.uuid;
                me.appendChild(img);
            }).error(function(data) {
                alert(data);
                console.log(data);
            });
        },
        setHTML(html) {
            if (!html) {
                html = "";
            }
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.innerHTML = html;
        },
        appendChild(el) {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.appendChild(el);
        },
        appendHTML(html) {
            if (!html) {
                html = "";
            }
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.innerHTML += html;
        },
        getContent() {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            return contentWindow.document.body.innerHTML;
        }
    },
    watch: {
        value() {
            if (this.value != this.getContent()) {
                this.setHTML(this.value);
            }
        },
        palette: {
            deep: true,
            handler: function() {
                let p = this.palette;
                this.color = `rgb(${p.red}, ${p.green}, ${p.blue})`;
                this.changeColor();
            }
        },
        img: {
            deep: true,
            handler() {
                let img = this.img;
                let iframe = this.$refs.iframe;
                var contentWindow = iframe.contentWindow;
                let selectedImg = contentWindow.selectedImg;
                selectedImg.style.width = img.width;
                selectedImg.style.height = img.height;
            }
        }
    }
}
module.exports.template = "<div class=\"jxiaui-rich-editor\" :style=\"getStyle()\">\r\n    <div class=\"toolbar\">\r\n        <div class=\"show-palette-btn\">\r\n            <jxiaui-button @click=\"togglePalette\" title=\"选择字体颜色\">\r\n                <span class=\"iconfont icon-Palette\"></span>\r\n                <span style=\"width: 30px;display: inline-block;\" :style=\"{background: color}\">&nbsp;&nbsp;</span>\r\n            </jxiaui-button>\r\n            <div class=\"dropdown\" v-if=\"palette.showFlag\">\r\n                <div><button @click=\"hidePalette\">确定</button></div>\r\n                <div style=\"display: flex;\">\r\n                    <div class=\"common-color-show\">\r\n                        <table>\r\n                            <tr v-for=\"row in palette.grid\">\r\n                                <td v-for=\"c in row\" @click=\"chooseColor(c)\" :style=\"{background: 'rgb(' + c + ')'} \">&nbsp;</td>\r\n                            </tr>\r\n                        </table>\r\n                    </div>\r\n                    <div class=\"color-adapt\">\r\n                        <table>\r\n                            <tr>\r\n                                <td>红色：</td>\r\n                                <td><input v-model=\"palette.red\" type=\"number\"></td>\r\n                            </tr>\r\n                            <tr>\r\n                                <td>绿色：</td>\r\n                                <td><input v-model=\"palette.green\" type=\"number\"></td>\r\n                            </tr>\r\n                            <tr>\r\n                                <td>蓝色：</td>\r\n                                <td><input v-model=\"palette.blue\" type=\"number\"></td>\r\n                            </tr>\r\n                        </table>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <jxiaui-button icon=\"image\" @click=\"insertPic\" title=\"插入图片\">\r\n            <input type=\"file\" ref=\"picFile\" @change=\"uploadPic\" style=\"display: none;\">\r\n        </jxiaui-button>\r\n    </div>\r\n    <div class=\"edit-pane\">\r\n        <iframe ref=\"iframe\" style=\"width: 100%;height: 100%;\"></iframe>\r\n    </div>\r\n    <div v-if=\"img\">\r\n        图片属性：<br> 宽：\r\n        <input v-model=\"img.width\"> 高：\r\n        <input v-model=\"img.height\">\r\n    </div>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-html-view',
    props: ['value', 'height'],
    data() {
        return {}
    },
    mounted() {
        let me = this;
        let value = this.value;
        let iframe = this.$refs.iframe;
        var contentWindow = iframe.contentWindow;
        let document = contentWindow.document;
        //但是IE与FireFox有点不同，为了兼容FireFox，所以必须创建一个新的document。
        document.open();
        document.writeln('<html><head></head><body></body></html>');
        document.close();
        this.setHTML(value);
    },
    methods: {
        getStyle() {
            let style = {};
            if (this.height) {
                style.height = this.height + "px";
            }
            return style;
        },
        setHTML(html) {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.innerHTML = html;
        },
        appendChild(el) {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.appendChild(el);
        },
        appendHTML(html) {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.innerHTML += html;
        },
        getContent() {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            return contentWindow.document.body.innerHTML;
        }
    },
    watch: {
        value() {
            if (this.value != this.getContent()) {
                this.setHTML(this.value);
            }
        }
    }
}
module.exports.template = "<div class=\"edit-pane\" :style=\"getStyle()\">\r\n    <iframe ref=\"iframe\" style=\"width: 100%;height: 100%;border: none;\"></iframe>\r\n</div>"
return module.exports;})(), 


(()=>{let module = {};
module.exports = {
    name: 'jxiaui-left-right-pane',
    props: ['leftWidth'],
    data() {
        return {
            startPos: null,
            resizeFlag: false,
            left: {
                widthO: 200,
                width: 200
            }
        }
    },
    mounted() {
        if (this.leftWidth) {
            this.left.widthO = this.leftWidth;
            this.left.width = this.leftWidth;
        }
    },
    updated() {},
    methods: {
        getLeftStyle() {
            let style = {};
            if (this.left.width) {
                style.width = this.left.width + 'px'
            }
            return style;
        },
        startResize(e) {
            this.startPos = {
                x: e.clientX,
                y: e.clientY
            }
            let me = this;
            this.resizeFlag = true;
            document.body.addEventListener("mouseup", function() {
                console.log("mouseup");
                me.startPos = null;
                me.left.widthO = me.left.width;
            }, false);

            document.body.addEventListener("mousemove", function(e) {
                console.log("mousemove");
                if (me.startPos) {
                    let dx = e.clientX - me.startPos.x;
                    me.left.width = me.left.widthO + dx;
                }
            }, false);
        }
    },
    watch: {}
}
module.exports.template = "<div class=\"jxiaui-left-right-pane\">\r\n    <div class=\"layout\">\r\n        <div class=\"left\" :style=\"getLeftStyle()\">\r\n            <slot name=\"left\"></slot>\r\n        </div>\r\n        <div class=\"width-adapter\" @mousedown.stop=\"startResize\"></div>\r\n        <div class=\"right\">\r\n            <div class=\"mask\" v-if=\"startPos\"></div>\r\n            <slot name=\"right\"></slot>\r\n        </div>\r\n    </div>\r\n\r\n</div>"
return module.exports;})(), 

)
