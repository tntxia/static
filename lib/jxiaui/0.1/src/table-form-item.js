module.exports = {
    name: 'jxiaui-table-form-item',
    props: ['label'],
    data() {
        return {
            visible: false
        }
    },
    mounted() {
        let slots = this.$slots;
        this.$parent.items.push({
            label: this.label,
            content: slots.default
        });
    }
}