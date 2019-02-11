function FileChoose(opt) {

    let initFlag;

    let container = $("#" + opt.id);

    let onChange = opt.onChange;

    container.delegate("li", "click", function(e) {

        e.stopPropagation();

        let li = $(this);

        if (onChange) {
            onChange(li.data("path"));
        }


        let ul = li.find("ul");
        if (ul.length) {
            ul.remove();
            return;
        }
        listFile(li);

    })

    this.init = function() {
        container.show();
        listFile(container);

    }

    this.hide = function() {
        container.hide();
    }

    this.show = function() {
        container.show();
        this.init();
    }

    function listFile(parent) {

        let path = parent.data("path");
        var ul = $("<ul>");
        parent.append(ul);
        $.ajax({
            url: '/file_center/choose.do',
            data: {
                parent: path
            },
            success: function(data) {

                $.each(data, function(i, d) {
                    let text;
                    if (d.root) {
                        text = d.absolutePath;
                    } else {
                        text = d.name;
                    }
                    var li = $("<li>", {
                        text
                    });
                    li.data("path", d.absolutePath);
                    ul.append(li);
                });

            }
        });

    }

}