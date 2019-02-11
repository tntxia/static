let http = {};
http.post = function(opt) {
    opt.type = "post";

    var dtd = $.Deferred();

    showLoadingDiv();
    $.ajax(opt).done(res => {
        dtd.resolve(res);
    }).fail(e => {
        dtd.reject(e);
    }).always(() => {
        hideLoadingDiv();
    });
    return dtd.promise();

    return $.ajax(opt);

    function showLoadingDiv() {
        if ($(".loading-div-top").length) {
            $(".loading-div-top").show();
            return;
        }
        let loadingDiv = $("<div>", {
            'class': 'loading-div-top'
        });
        $("body").append(loadingDiv);
        let span = $("<span>", {
            'class': 'message',
            text: '请求中，请稍候。。。'
        });
        loadingDiv.append(span);
    }

    function hideLoadingDiv() {
        $(".loading-div-top").hide();
    }
}