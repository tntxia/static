module.exports = {
    name: 'jxiaui-ip-input',
    props: ['value'],
    data() {
        return {
            // ip v4
            segs: [{
                value: null
            }, {
                value: null
            }, {
                value: null
            }, {
                value: null
            }]
        }
    },
    mounted() {
        this.handleValue();
    },
    updated() {},
    methods: {
        handleValue() {
            let value = this.value;
            if (!value) {
                this.v = null;
                this.$emit("input", null);
                return;
            }
            this.segs = this.value.split(".").map(item => { return { "value": item } });
        },
        handleChange() {
            let segList = this.segs.map(item => item.value);
            this.$emit("input", segList.join("."))
        }
    },
    watch: {
        value() {
            this.handleValue();
        }
    }
}