module.exports = {
    name: 'jxiaui-checkbox',
    props: ['value', 'trueValue', 'falseValue'],
    data() {
        return {
            v: null
        }
    },
    mounted() {
        this.handleValue();
    },
    updated() {},
    methods: {
        handleValue() {
            let value = this.value;
            let trueValue = this.trueValue;
            let falseValue = this.falseValue;
            if (trueValue) {
                if (value === trueValue) {
                    this.v = true;
                }
            }
            if (falseValue) {
                if (value === falseValue) {
                    this.v = false;
                }
            }
            if (this.v === null) {
                this.v = value;
            }
        },
        handleChange() {
            let v = this.v;
            let value;
            let trueValue = this.trueValue;
            let falseValue = this.falseValue;
            if (trueValue) {
                if (v) {
                    value = trueValue;
                }
            }
            if (falseValue) {
                if (!v) {
                    value = falseValue;
                }
            }
            this.$emit("input", value);
        }
    },
    watch: {
        value() {
            this.handleValue();
        }
    },
}