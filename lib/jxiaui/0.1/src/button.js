module.exports = {
    name: 'jxiaui-button',
    props: ['loading', 'icon'],
    data() {
        return {
            v: null,
            props: {
                disabled: false
            }
        }
    },
    mounted() {},
    updated() {},
    methods: {
        handleClick() {
            this.props.disabled = true;
            setTimeout(() => {
                this.props.disabled = false;
            }, 2000);
            this.$emit("click");
        }
    },
    computed: {
        prevIcon() {
            if (this.loading) {
                return 'fa fa-spin fa-spinner'
            }
            if (!this.icon) {
                return null;
            }
            return 'fa fa-' + this.icon;
        }
    }
}