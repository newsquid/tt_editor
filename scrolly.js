var scroll_amount = function() {
    //Ubuntu Firefox
    console.log("body: "+$("body").scrollTop());

    console.log("site-header: "+$(".site-header").scrollTop());
    console.log("document: "+$(document).scrollTop());
    console.log("window: "+$(window).scrollTop());
    console.log("html: "+$("html").scrollTop());

    //Ubuntu Firefox
    console.log("js-body: "+document.body.scrollTop);

    console.log("js-document: "+document.documentElement.scrollTop);
    console.log("js-window: "+window.pageYOffset);
    console.log("body-offset: "+$("body").offset().top);

    //Ubuntu Chrome
    console.log("site-header-offset: "+(-$(".site-header").offset().top));

    return Math.max(
        $("body").scrollTop(),
        -$(".site-header").offset().top
    );
};
