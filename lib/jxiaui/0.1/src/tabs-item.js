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