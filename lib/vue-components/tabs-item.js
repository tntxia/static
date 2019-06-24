(function(globe) {
    if (!globe.Vue) {
        console.warn("可能你还没导入Vue的引用。。。");
    }

    globe.Vue.component("jxia-tabs-item", {
        props: ['label'],
        data() {
            return {
                visible: false
            }
        },
        template: '<div v-if="visible"><slot></slot></div>',
        mounted() {},
    });

})(window);