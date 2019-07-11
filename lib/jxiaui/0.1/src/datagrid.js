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
                tag: 'input',
                options: {
                    attrs: {
                        type: 'checkbox',
                        checked: me.checkedAll
                    },
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
                tag: 'tr'
            };

            if (this.check) {
                let td = {
                    tag: 'td'
                }
                append(tr, td);

                let checkbox = {
                    tag: 'input',
                    options: {
                        attrs: {
                            type: 'checkbox',
                            checked: row.checked
                        },
                        on: {
                            click() {
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
    props: ["dataset", "check"],
    data() {
        return {
            loading: false,
            checkedAll: false,
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
        getRows() {
            return this.rows;
        },
        getSelectedRows() {
            return this.rows.filter(row => row.checked);
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
                let rows = res.rows;
                if (me.check) {
                    rows.forEach(row => {
                        row.checked = false;
                    })
                }
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