module.exports = {
    name: 'jxiaui-tree',
    props: ['data'],
    render: function(h) {

        let treeData = copy(this.treeData);

        let treeNodeRender = this.$scopedSlots.default;

        let domTree = {
            tag: 'div',
            options: {
                'class': 'jxiaui-tree'
            }
        };

        let rootNodesData = [];

        if (treeData) {
            let i = 0;
            while (i < treeData.length) {
                let treeNodeData = treeData[i];
                if (!treeNodeData.pid) {
                    rootNodesData.push(treeNodeData);
                    treeData.splice(i, 1);
                } else {
                    i++;
                }
            }
        }


        rootNodesData.forEach(root => {
            createNode(domTree, root);
        });

        return createDom(domTree);

        function copy(arr) {
            if (!arr) {
                return arr;
            }
            let res = [];
            arr.forEach(item => {
                res.push(item);
            })
            return res;
        }

        function createDom(el) {
            let tag = el.tag;
            let opt = el.options;
            if (!opt) {
                opt = {};
            }
            let children = [];
            if (el.children && el.children.length) {
                for (let i = 0; i < el.children.length; i++) {
                    let child = el.children[i];
                    if (!child) {
                        children.push("");
                    } else {
                        if (isVNode(child) || typeof child === "string") {
                            children.push(child);
                        } else if (typeof child === "number") {
                            children.push(child + "");
                        } else {
                            children.push(createDom(child));
                        }
                    }

                }
            }
            return h(el.tag, opt, children);
        }

        function createNode(parent, nodeData) {

            let div = {
                id: nodeData.id,
                tag: 'div'
            }

            let content = treeNodeRender(nodeData);
            let children = [];
            if (content.length) {
                children = content;
            } else {
                children = [content];
            }
            let textDiv = {
                tag: 'div',
                children: children
            }
            append(div, textDiv);

            if (isDomTree(parent)) {
                append(parent, div);
            } else {
                // 用来放子结点的Div
                let childrenDiv;
                if (parent.children && parent.children.length && parent.children.length > 1) {
                    childrenDiv = parent.children[1];
                } else {
                    childrenDiv = {
                        tag: 'div',
                        options: {
                            'class': 'children-container'
                        }
                    }
                    append(parent, childrenDiv);
                }
                append(childrenDiv, div);
            }

            let childrenData = [];
            treeData.forEach(treeNodeData => {
                if (treeNodeData.pid == nodeData.id) {
                    childrenData.push(treeNodeData);
                }
            });

            childrenData.forEach(childData => {
                createNode(div, childData);
            });

            return div;
        }

        function isDomTree(node) {
            return node && node.options && node.options.class === 'jxiaui-tree';
        }

        function append(el, children) {
            if (!el.children) {
                el.children = [];
            }

            if (children.length) {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    el.children.push(child);
                }
            } else {
                el.children.push(children);
            }
        }

        function isVNode(el) {
            if (el && el.constructor && el.constructor.name === "VNode") {
                return true;
            }
            return false;
        }

    },
    data() {
        return {
            treeData: []
        }
    },
    mounted() {
        this.treeData = this.data;
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
        data() {
            this.treeData = this.data;
        }
    }
}