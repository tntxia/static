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