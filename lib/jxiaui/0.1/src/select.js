module.exports = {
    name: 'jxiaui-select',
    props: ['url', 'labelName', 'valueName'],
    data() {
        return {
            v: null,
            list: []
        }
    },
    mounted() {
        this.$http.get(this.url).then(res => {
            let data = res.body;
            if (data.data) {
                data = data.data;
            }
            if (data.rows) {
                data = data.rows;
            }
            let list = [];
            let labelName = this.labelName;
            let valueName = this.valueName;
            data.forEach(item => {
                list.push({
                    label: item[labelName],
                    value: item[valueName]
                })
            })
            this.list = list;
            if (this.value) {
                this.v = this.value;
            } else {
                if (list && list.length) {
                    this.v = list[0].value;
                }
            }
        });

    },
    methods: {
        handleChange() {
            let segList = this.segs.map(item => item.value);
            this.$emit("input", segList.join("."))
        }
    },
    watch: {
        v() {
            this.$emit("input", this.v);
        }
    }
}