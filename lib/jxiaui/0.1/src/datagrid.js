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