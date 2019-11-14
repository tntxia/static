function LayoutMain(parent) {

    let parentWidth = parent.width;
    let leftbarWidth = 0;
    if (parent.leftbar) {
        leftbarWidth = parent.leftbar.width;
    }
    let mainSecWidth = parentWidth - leftbarWidth;
    parent.mainSecWidth = mainSecWidth;

    let layoutMainDiv = $("<div>", {
        'class': 'layout-main'
    });
    let headerHeight = parent.headerHeight;
    layoutMainDiv.css({
        left: leftbarWidth,
        top: headerHeight,
        width: mainSecWidth
    });
    parent.el.append(layoutMainDiv);
    parent.mainDiv = layoutMainDiv;

    let mainOpt = parent.opt.main;
    if (mainOpt.crumb) {
        let crumbDiv = $("<div>", {
            'class': 'layout-main-crumb'
        });
        layoutMainDiv.append(crumbDiv);
        parent.opt.router.crumbDiv = crumbDiv;
        parent.crumbDiv = crumbDiv;
    }

    let mainSection = $("<div>", {
        'class': 'main_sec'
    });
    parent.mainSec = mainSection;
    layoutMainDiv.append(mainSection);
}