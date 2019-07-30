module.exports = {
    name: 'jxiaui-combobox',
    props: {
        value: {},
        dataset: {},
        width: {},
        paramField: {
            default: 'name'
        }
    },
    data() {
        return {
            showFlag: false,
            lastSearchText: null,
            searchText: null,
            params: {},
            choosed: null,
            list: [],
            field: 'name',
            label: 'name'
        }
    },
    mounted() {
        if (this.dataset.field) {
            this.field = this.dataset.field;
        }
        if (this.dataset.label) {
            this.label = this.dataset.label;
        }
        this.loadData();
    },
    updated() {},
    methods: {
        loadData(params) {
            return new Promise((resolve, reject) => {
                let me = this;
                $.ajax({
                    url: this.dataset.url,
                    type: 'post',
                    data: params
                }).done(res => {
                    let list;
                    if ($.isArray(res)) {
                        list = res;
                    } else {
                        list = res.rows;
                    }
                    me.list = list;
                    resolve(list);
                })
            });
        },
        handleChange() {

        },
        handleKeyup() {
            console.log("keyup happen,", this.searchText);
            if (this.searchText != this.lastSearchText) {
                this.lastSearchText = this.searchText;
                let paramField = this.paramField;
                let param = {};
                param[paramField] = this.searchText;
                this.loadData(param).then(list => {
                    // 如果查询结果只有一个，而且和输入完全吻合，直接作为选择项
                    if (list && list.length === 1 && list[0][me.label] === this.searchText) {
                        this.choosed = list[0];
                    }
                    this.showFlag = true;
                });
            }
        },
        choose(item) {
            this.searchText = item[this.field];
            this.choosed = item;
            this.showFlag = false;
        },
        handleClick() {
            this.showFlag = !this.showFlag;
        }
    },
    watch: {
        choosed() {
            let choosed = this.choosed;
            this.$emit("change", this.choosed);
            if (!choosed) {
                this.$emit("input", null);
                return;
            }
            this.$emit("input", choosed[this.field]);
        }
    },
}