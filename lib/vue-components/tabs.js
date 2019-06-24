(function(globe) {
    if (!globe.Vue) {
        console.warn("可能你还没导入Vue的引用。。。");
    }
    globe.Vue.component("jxia-tabs", {
        data() {
            return {
                items: []
            }
        },
        template: '<div class="jxia-tabs">' +
            '<div class="jxia-tabs-head">' +
            '<div class="jxia-tabs-head-item" @click="chooseTab(item)" v-for="(item,index) in items" :key="index" :class="{\'active\': item.active }">{{item.label}}</div>' +
            '</div>' +
            '<div><slot></slot></div>' +
            '</div>',
        mounted() {
            let slotDefault = this.$slots.default;
            for (let i = 0; i < slotDefault.length; i++) {
                let item = slotDefault[i];
                let comp = item.componentInstance;
                if (!comp) {
                    continue;
                }
                this.items.push({
                    label: comp.label,
                    active: false,
                    comp: comp
                });
            }
            this.items[0].active = true;
            this.items[0].comp.visible = true;
        },
        methods: {
            chooseTab(item) {
                this.items.forEach(item => {
                    item.active = false;
                    item.comp.visible = false;
                });
                this.activeTab(item);
            },
            activeTab(item) {
                item.active = true;
                item.comp.visible = true;
            }
        },
    });

})(window);