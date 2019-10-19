module.exports = {
    name: 'jxiaui-upload-image',
    props: ['src'],
    data() {
        return {
            picSrc: null
        }
    },
    mounted() {
        let me = this;
        if (this.src) {
            this.picSrc = this.src;
        } else {
            this.picSrc = '/static/images/no-pic.png';
        }
        let fileInput = this.$refs["fileInput"];
        let pic = this.$refs["pic"];
        pic.addEventListener("click", function() {
            fileInput.click();
        });
        fileInput.addEventListener("change", function(e) {
            let file = me.getFile();
            var URL = window.URL || window.webkitURL;
            var result = URL.createObjectURL(file);
            pic.src = result;
        });
    },
    methods: {
        getFile() {
            let fileInput = this.$refs["fileInput"];
            let files = fileInput.files;
            if (!files || !files.length) {
                return null;
            }
            let file = files[0];
            return file;
        }
    },
    watch: {
        src() {
            this.picSrc = this.src;
        }
    }
}