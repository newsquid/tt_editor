    (function($) {
        $(document).ready(function() {
            $("#nav-search").click(function(e) {
                e.preventDefault();
                $("#searchbar").fadeIn('slow')
                    .keydown(function(event) {
                       if(event.which == 13)
                           location.href = "/posts/search/"+$(this).val(); 
                    })
                    .text("")
                    .focus();
                return false;
            });
        });
    })(jQuery);
