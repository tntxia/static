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
        this.maxHeight = bodyHeight - bodyHeight * 0.3;
    },
    updated() {},
    methods: {
        close() {
            debugger
            this.$emit("close");
        }
    }
}