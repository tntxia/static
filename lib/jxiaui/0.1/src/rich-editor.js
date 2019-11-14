module.exports = {
    name: 'jxiaui-rich-editor',
    props: ['value', 'height'],
    data() {
        return {
            img: null,
            color: 'rgb(0, 0, 0)',
            palette: {
                showFlag: false,
                grid: [
                    ['255,206,45', '98,147,187', '167,212,60'],
                    ['23,206,142', '95,147,187', '41,212,60'],
                    ['178,20,142', '195,47,120', '41,20,60'],
                ],
                red: 0,
                green: 0,
                blue: 0
            }
        }
    },
    mounted() {
        let me = this;
        let value = this.value;
        let iframe = this.$refs.iframe;
        var contentWindow = iframe.contentWindow;
        let document = contentWindow.document;
        document.designMode = "on";
        document.contentEditable = true;
        //但是IE与FireFox有点不同，为了兼容FireFox，所以必须创建一个新的document。
        document.open();
        document.writeln('<html><head></head><body></body></html>');
        document.close();

        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.innerHTML = ".selected{border:2px solid blue}";
        style.type = 'text/css';
        head.appendChild(style);

        document.addEventListener("keyup", function() {
            let content = contentWindow.document.body.innerHTML;
            me.$emit("input", content)
            console.log(content);
        }, false);
        document.addEventListener("click", function(e) {
            let imgs = document.querySelectorAll("img");
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].className = "";
            }
            let target = e.target;
            if (target.tagName === "IMG") {
                target.className = "selected";
                me.img = {
                    width: target.width,
                    height: target.height
                };
                contentWindow.selectedImg = target;
            } else {
                me.img = null;
            }
            console.log(e);
        }, false);
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
        togglePalette() {
            this.palette.showFlag = true;
        },
        hidePalette() {
            this.palette.showFlag = false;
        },
        chooseColor(rgb) {
            let sp = rgb.split(",");
            this.palette.red = parseInt(sp[0]);
            this.palette.green = parseInt(sp[1]);
            this.palette.blue = parseInt(sp[2]);
        },
        changeColor() {
            let iframe = this.$refs.iframe;
            var contentWindow = iframe.contentWindow;
            var doc = contentWindow.document;
            console.log("execute forecolor", this.color);
            doc.execCommand('forecolor', false, this.color);
        },
        insertPic() {
            this.$refs.picFile.click();
        },
        uploadPic() {
            let me = this;
            let file = this.$refs.picFile.files[0];
            let param = new FormData(); // 创建form对象
            param.append('file', file); //对应后台接收图片名
            $.ajax({
                type: "POST",
                data: param,
                url: '/file_center/file!upload.do',
                contentType: false,
                processData: false,
            }).success(function(data) {
                let img = document.createElement("img");
                img.src = "/file_center/file!showPic.do?uuid=" + data.uuid;
                me.appendChild(img);
            }).error(function(data) {
                alert(data);
                console.log(data);
            });
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
        },
        palette: {
            deep: true,
            handler: function() {
                let p = this.palette;
                this.color = `rgb(${p.red}, ${p.green}, ${p.blue})`;
                this.changeColor();
            }
        },
        img: {
            deep: true,
            handler() {
                let img = this.img;
                let iframe = this.$refs.iframe;
                var contentWindow = iframe.contentWindow;
                let selectedImg = contentWindow.selectedImg;
                selectedImg.style.width = img.width;
                selectedImg.style.height = img.height;
            }
        }
    }
}