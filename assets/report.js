(function($) {
    
    function promptReportArticle(article_id) {
        getPromptContent(article_id, function(content) {
            var $modal = $.d_modal(content);
            var $form = $modal.find('.report-form');

            new ReportForm($form, {
                success: function() {
                    $modal.trigger("dismiss");
                    $.d_modal("<h1>Message sent</h1>");
                },
                error: function() {
                    $.d_modal("Failed to send report :(<br>Check your connection and try again!");
                }
            });
        });
    }

    function getPromptContent(article_id, callback) {
        $.ajax({
            url: "/posts/"+article_id+"/report_view",
            success: callback
        });
    }

    $(document).ready(function() {
        $(".article-interact .report").click(function(event) {
            promptReportArticle($(this).attr("data-article-id"));

            event.preventDefault();
            return false;
        });
    });

})(jQuery);
