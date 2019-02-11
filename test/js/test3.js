$(function() {

    http.post({
        url: '/file_center/file!showPic.do',
        data: {
            uuid: 'test'
        }
    }).then(res => {
        console.log(res);
    }, e => {
        console.log(e);
    })

})