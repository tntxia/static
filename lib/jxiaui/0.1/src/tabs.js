module.exports = {
    name: 'jxiaui-tabs',
    data() {
        return {
            items: []
        }
    },
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
    updated() {

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
    }
}