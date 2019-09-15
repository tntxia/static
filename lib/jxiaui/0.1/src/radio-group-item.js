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