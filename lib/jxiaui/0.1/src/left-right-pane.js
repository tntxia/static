module.exports = {
    name: 'jxiaui-left-right-pane',
    props: ['leftWidth'],
    data() {
        return {
            startPos: null,
            resizeFlag: false,
            left: {
                widthO: 200,
                width: 200
            }
        }
    },
    mounted() {
        if (this.leftWidth) {
            this.left.widthO = this.leftWidth;
            this.left.width = this.leftWidth;
        }
    },
    updated() {},
    methods: {
        getLeftStyle() {
            let style = {};
            if (this.left.width) {
                style.width = this.left.width + 'px'
            }
            return style;
        },
        startResize(e) {
            this.startPos = {
                x: e.clientX,
                y: e.clientY
            }
            let me = this;
            this.resizeFlag = true;
            document.body.addEventListener("mouseup", function() {
                console.log("mouseup");
                me.startPos = null;
                me.left.widthO = me.left.width;
            }, false);

            document.body.addEventListener("mousemove", function(e) {
                console.log("mousemove");
                if (me.startPos) {
                    let dx = e.clientX - me.startPos.x;
                    me.left.width = me.left.widthO + dx;
                }
            }, false);
        }
    },
    watch: {}
}