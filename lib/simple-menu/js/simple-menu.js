function SimpleMenu(opt) {

    let target = opt.target;
    let url = opt.url;

    var ul = $("<ul>", {
        'class': 'simple-menu'
    });
    target.append(ul);

    $.ajax({
        url: url
    }).done(res => {
        $.each(res, (i, d) => {
            let li = $("<li>");
            if (d.active) {
                li.addClass("active");
            }
            let a = $("<a>", {
                text: d.name,
                href: d.url
            });
            li.append(a);
            ul.append(li);
        });
    }).fail(e => {
        console.error(e);
    });


}