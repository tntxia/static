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