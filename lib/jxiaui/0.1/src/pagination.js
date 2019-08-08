module.exports = {
    name: 'jxiaui-pagination',
    props: ['page', 'pageSize', 'total'],
    data() {
        return {
            firstPageShowFlag: false,
            lastPageShowFlag: false,
            pageList: [],
            pageSizeList: [5, 10, 20, 50, 100],
            totalPage: 0,
            paging: {
                page: 1,
                pageSize: 10
            },
            visible: false
        }
    },
    mounted() {
        this.paging.page = this.page;
        this.paging.pageSize = this.pageSize;
        this.init();
    },
    methods: {
        init() {
            let page = this.paging.page;
            let total = this.total;
            let pageSize = this.paging.pageSize;
            this.paging.pageSize = pageSize;
            let totalPage = total % pageSize === 0 ? total / pageSize : Math.ceil(total / pageSize);
            this.totalPage = totalPage;
            this.pageList = [];
            let pageListMaxSize = 3;
            let pageListStartPage = page - Math.floor(pageListMaxSize / 2);
            if (pageListStartPage < 1) {
                pageListStartPage = 1;
            }
            let pageListEndPage = pageListStartPage + pageListMaxSize - 1;
            if (pageListEndPage > totalPage) {
                pageListEndPage = totalPage;
                pageListStartPage = pageListEndPage - pageListMaxSize + 1;
                if (pageListStartPage < 1) {
                    pageListStartPage = 1;
                }
            }
            for (let i = pageListStartPage; i <= pageListEndPage; i++) {
                this.pageList.push(i);
            }
            if (this.pageList.indexOf(1) == -1) {
                this.firstPageShowFlag = true;
            } else {
                this.firstPageShowFlag = false;
            }
            if (this.pageList.indexOf(totalPage) == -1) {
                this.lastPageShowFlag = true;
            } else {
                this.lastPageShowFlag = false;
            }

        },
        choose(page) {
            this.paging.page = page;
            this.$emit("page-change", page);
            this.init();
        },
        pageSizeChange() {
            this.paging.page = 1;
            this.$emit("page-size-change", this.paging.pageSize);
            this.init();
        }
    },
    watch: {
        total() {
            this.paging.total = this.total;
            this.init();
        },
        pageSize() {
            this.paging.pageSize = this.pageSize;
            if (this.pageSizeList.indexOf(this.pageSize) === -1) {
                this.pageSizeList.push(this.pageSize);
                this.pageSizeList = this.pageSizeList.map(item => parseInt(item)).sort((a, b) => {
                    if (a > b) {
                        return 1;
                    } else if (a < b) {
                        return -1
                    } else {
                        return 0;
                    }
                });
            }
            this.init();
        }
    },
}