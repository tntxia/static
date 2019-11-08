module.exports = {
    name: 'jxiaui-dialog',
    props: {
        title: {},
        width: {
            default: 500
        }
    },
    data() {
        return {
            maxHeight: null,
            showFlag: false
        }
    },
    mounted() {

    },
    updated() {},
    methods: {
        show() {
            this.showFlag = true;
            this.$nextTick(function() {
                this.adapt();
            });
        },
        adapt() {
            let box = this.$refs["dialogBox"];
            let bodyWidth = document.body.clientWidth;
            let bodyHeight = document.body.clientHeight;
            let width = box.clientWidth;
            box.style.left = (bodyWidth - width) / 2 + "px";

            let content = box.querySelector(".jxiaui-dialog-box-content");
            content.style["max-height"] = (bodyHeight * 0.7 - 30) + "px";
            console.log("body width", bodyWidth);

            console.log("box width", width);
        },
        close() {
            this.showFlag = false;
            this.$emit("close");
        }
    }
}