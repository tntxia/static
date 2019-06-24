function EasyZTree(opt) {

    var url = opt.url;
    var div = opt.target;
    var onFinish = opt.onFinish;

    var check = opt.check;

    let rightClickNode;
    let contextmenu;

    var setting = {
        edit: {
            enable: false,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        callback: {
            onRightClick: OnRightClick,
            beforeDrag: OnBeforeDrag,
            beforeDrop: function() {
                return true;
            },
            onDrop: OnDrop
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: ""
            }
        }
    };

    if (check) {
        setting.check = {};
        setting.check.enable = true;
    }

    let initTreeNode = [];
    let rootNode = opt.rootNode;
    if (rootNode) {
        initTreeNode.push(rootNode);
    }
    var tree = $.fn.zTree.init(div, setting, initTreeNode);
    tree.setting.edit.drag.isCopy = true;
    tree.setting.edit.drag.isMove = true;
    tree.setting.edit.drag.prev = true;
    tree.setting.edit.drag.inner = true;
    tree.setting.edit.drag.next = true;

    $.ajax({
        url: url
    }).done(function(data) {

        let treeNodes;
        if ($.isArray(data)) {
            treeNodes = data;
        } else {
            treeNodes = data.data;
        }
        $.fn.zTree.init(div, setting, treeNodes);
        if (onFinish) {
            onFinish();
        }
    });

    this.getTree = function() {
        return tree;
    }

    this.addNode = function(node) {

    }

    function OnRightClick(event, treeId, treeNode) {

        if (opt.contextmenu) {
            rightClickNode = treeNode;

            if (!$(".easy-ztree-menu").length) {
                contextmenu = $("<div>", {
                    'class': 'easy-ztree-menu'
                });
                $("body").append(contextmenu);
                let ul = $("<ul>");
                contextmenu.append(ul);
                let items = opt.contextmenu.items;
                $.each(items, function(i, d) {
                    let li = $("<li>", {
                        text: d.text
                    });
                    li.data("handler", d.click);
                    li.click(function(e) {
                        e.stopPropagation();
                        let handler = li.data("handler");
                        if (handler) {
                            handler.call(tree, rightClickNode);
                            hideContextMenu();
                        }
                    })
                    ul.append(li);
                });
            } else {
                contextmenu = $(".easy-ztree-menu");
            }
            contextmenu.css({
                left: event.clientX,
                top: event.clientY
            });
            contextmenu.show();
            document.addEventListener("click", hideContextMenu, false);
        }
    }

    function OnBeforeDrag() {
        return true;
    }

    function OnDrop(e, treeId, sourceNode, targetNode, location) {
        if (opt.onDrop)
            opt.onDrop(sourceNode, targetNode, location);
    }

    function hideContextMenu() {
        contextmenu.hide();
        document.removeEventListener("click", hideContextMenu, false);
    }
}