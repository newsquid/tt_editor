var setUpReadRegistering = (function($) {
    var read_registered = false;
    var waiting_to_register = false;
    var register_read_url;
    var $article_text = $(".article-text");

    function endOfTextVisible() {
        if(textBottomOffset() < greatestOffsetVisible())
            return true;
        return false;
    }

    function textBottomOffset() {
        return $article_text.offset().top + $article_text.height();
    }

    function greatestOffsetVisible() {
        return $(window).scrollTop() + $(window).height();
    }

    function registerRead() {
        if(waiting_to_register) return;
        waiting_to_register = true;

        $.ajax(register_read_url, {
          type: "post",
          error: function() {
              console.error("Failed to register read; retrying in "+retry_in+"ms.");
              waiting_to_register = false;
              setTimeout(registerRead, 5000);
          },
          success: function() {
              read_registered = true;
          }
        });
    }

    function considerRegisteringRead() {
        if(endOfTextVisible() && !read_registered && !waiting_to_register)
            registerRead();
    }

    return function(register_url) {
        register_read_url = register_url;
        $("body").scroll(considerRegisteringRead);
        $(window).scroll(considerRegisteringRead);
    }
})(jQuery);
