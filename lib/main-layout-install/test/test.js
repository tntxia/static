$(function() {
    MainLayoutInstall.install({
        headerHeight: 60,
        headerTemplate: 'header.html'
    }).then((mainLayout) => {
        mainLayout.setLeftbar([{
            text: '首页',
            buttons: [{
                url: 'hello.html',
                text: "菜单1"
            }]
        }])
        console.log("main layout installed!!!!");
    });
});