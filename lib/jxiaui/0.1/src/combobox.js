module.exports = {
    name: 'jxiaui-combobox',
    props: ['value', 'dataset', 'width'],
    data() {
        return {
            showFlag: false,
            lastSearchText: null,
            searchText: null,
            params: {},
            list: []
        }
    },
    mounted() {},
    updated() {},
    methods: {
        loadData(params) {
            let me = this;
            $.ajax({
                url: this.dataset.url,
                data: params
            }).done(res => {
                if ($.isArray(res)) {
                    me.list = res;
                } else {
                    me.list = res.rows;
                }
                me.showFlag = true;
            })
        },
        handleChange() {
            // this.loadData();
        },
        handleKeyup() {
            console.log("keyup happen,", this.searchText);
            if (this.searchText != this.lastSearchText) {
                this.lastSearchText = this.searchText;
                this.loadData({
                    name: this.searchText
                })
            }
        },
        choose(item) {
            this.searchText = item.name;
            this.showFlag = false;
        },
        handleClick() {
            this.showFlag = !this.showFlag;
        }
    },
    watch: {
        v() {
            this.$emit("input", v);
        }
    },
}