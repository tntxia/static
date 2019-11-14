module.exports = {
    name: 'jxiaui-html-view',
    props: ['value', 'height'],
    data() {
        return {}
    },
    mounted() {
        let me = this;
        let value = this.value;
        let iframe = this.$refs.iframe;
        var contentWindow = iframe.contentWindow;
        let document = contentWindow.document;
        //但是IE与FireFox有点不同，为了兼容FireFox，所以必须创建一个新的document。
        document.open();
        document.writeln('<html><head></head><body></body></html>');
        document.close();
        this.setHTML(value);
    },
    methods: {
        getStyle() {
            let style = {};
            if (this.height) {
                style.height = this.height + "px";
            }
            return style;
        },
        setHTML(html) {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.innerHTML = html;
        },
        appendChild(el) {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.appendChild(el);
        },
        appendHTML(html) {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            contentWindow.document.body.innerHTML += html;
        },
        getContent() {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            return contentWindow.document.body.innerHTML;
        }
    },
    watch: {
        value() {
            if (this.value != this.getContent()) {
                this.setHTML(this.value);
            }
        }
    }
}