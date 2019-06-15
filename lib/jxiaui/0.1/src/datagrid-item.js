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