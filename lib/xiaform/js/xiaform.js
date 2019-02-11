
/**
 * 
 * 专门处理表单的框架
 * @author tntxia
 * @since 2019-02-10
 */
let xiaFormScope = {};
$(function(){
    let forms = $("xiaform");
    forms.each(item => {
        let form = $(item);
        let opt = eval("(" + form.attr("option") +")");
        $(item).buildform(opt, xiaFormScope);
    });
})