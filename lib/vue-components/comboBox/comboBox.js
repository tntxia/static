(function(globe) {
    if (!globe.Vue) {
        console.warn("可能你还没导入Vue的引用。。。");
    }
    globe.Vue.component("jxia-combobox", {
        props: ["dataset"],
        data() {
            return {
                items: []
            }
        },
        template: '<div class="jxia-combobox">' +
            '<input class="jxia-combobox">' +
            '<ul><li v-for="(item,index) in dataset" :key="index">{{item.label}}</li></ul>' +
            '</div>',
        mounted() {

        },
        methods: {

        },
    });

})(window);