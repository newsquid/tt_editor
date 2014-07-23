(function($) {
    $(document).ready(function() {
        var $commentsSection = $('.article-comments');
        var $addLink = $commentsSection.find('.add-comment-link-container');
        var $commentForm = $commentsSection.find('.comment-container');
        var $commentList = $commentsSection.find('.comment-list');
        var $comment = $('<div class="comment"><div class="comment-author"><div class="author-img"></div><div class="author-name"></div><div class="comment-created"></div><div class="manage-comment"><a class="edit-link">Edit</a><a class="delete-link">Delete</a></div></div><div class="comment-text"></div></div>');
        var current_reader_name = $("#current-user-name-leak").data("value");
        var current_reader_image = $("#current-user-image-leak").data("value");

        var $form = new Form($commentForm.find('form'), {
            success: function(data) {
                addComment(data);

                //remove form
                $commentForm.find(".cancel-comment").click();
            }
        });

        var delete_click = function(e) {
            var $this = $(this);
            var $comment = $this.parent().parent().parent();
            $.ajax({
                url: $(this).attr("href"),
                type: "post",
                success: function() {
                    $comment.slideUp(function() {
                        $(this).remove();
                    });
                },
                error: function() {
                    console.log("Error deleting comment: "+JSON.stringify(arguments));
                }
            });
            e.preventDefault();
            return false;
        };

        var edit_click = function(e) {
            $commentForm.find('.cancel-comment').click();
            var $this = $(this);
            var $comment = $this.parent().parent().parent();
            var content = simple_unformat($comment.find('.comment-text').html());
            var saveHref = $this.attr("href");
            $addLink.find('a').click();
            $commentForm.find('textarea').val(content);
            location.hash = "comments";
            $comment.slideUp();

            //Rebind form controls + change labels
            $commentForm.find('.cancel-comment').one('click',function(e) {
                $commentForm.find('textarea').val('');
                $comment.slideDown();

                //Change form controls back
                //TODO: ::__315981ylfkhaflskh!!!!
            });
            $commentForm.find('input[type=submit]').val("Update comment").one('click', function(e) {
                //Send update
                $.ajax({
                    url: saveHref,
                    type: "post",
                    data: { content: $commentForm.find('textarea').val() },
                    success: function() {
                        //Set value of comment, then open it
                        $comment
                            .find('.comment-text')
                                .html(simple_format($commentForm.find('textarea').val()))
                            .end()
                            .slideDown();

                        //Change form controls back
                        $commentForm.find('.cancel-comment').click();
                        $commentForm.find('input[type=submit]').val("Add comment");
                    }
                });

                e.preventDefault();
                return false;
            });

            e.preventDefault();
            return false;
        };

        $addLink.find(".add-comment-link").click(function() {
            $addLink.slideUp();
            $commentForm.slideDown();
        });

        $commentForm.find(".cancel-comment").click(function() {
            $addLink.slideDown();
            $commentForm.slideUp();
            $commentForm.find('textarea').val('');
        });

        function addComment(data) {
            var content = simple_format(data.content);

            $comment.clone().appendTo($commentList)
                .find('.author-img')
                    .css('background-image','url('+current_reader_image+')')
                .end()
                .find('.author-name')
                    .text(current_reader_name)
                .end()
                .find('.comment-created')
                    .text("Just now")
                .end()
                .find('.comment-text')
                    .html(content)
                .end()
                .find('.delete-link')
                    .attr("href","/posts/"+data.post_id+"/comment/"+data.id+"/delete")
                    .click(delete_click)
                .end()
                .find('.edit-link')
                    .attr("href","/posts/"+data.post_id+"/comment/"+data.id)
                    .click(edit_click)
                .end()
                .hide().slideDown();
        }

        function simple_format(content) {
            return '<p>' + content.replace('\n\n', '</p><p>', "gm").replace('\n', '<br>', "gm") + '</p>';
        }

        function simple_unformat(content) {
            return content.replace('<p>', '', 'gm').replace('</p>', '\n\n', 'gm').replace('<br>','\n','gm').trim();
        }

        //Show/hide comments
        var comments_shown = false;
        $(".view-comments-button").click(function() {
            var $this = $(this);
            if(comments_shown) {
                $this.text("View comments");
                $commentsSection.slideUp("slow");
                comments_shown = false;
            }
            else {
                $this.text("Hide comments");
                $commentsSection.slideDown("slow").css('display','block');
                comments_shown = true;
            }
        });

        $(".delete-link").click(delete_click);
        $(".edit-link").click(edit_click);
    });
})(jQuery);