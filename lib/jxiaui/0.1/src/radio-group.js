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