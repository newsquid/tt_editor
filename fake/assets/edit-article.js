(function($) {
    var media_selector_potentially_open = false;
    var waiting_for_media_add = false;
    var mouse_over_item = false;

    $(document).ready(function() {
        var $content = $("#content");
        var $title = $("#title");
        var $articleText = $("#article-text");

        $content.keydown(function(e) {
            if(!firstIsParagraph()) {
                document.execCommand('formatBlock', false, 'p');
            }
            if(firstIsBr()) {
                $("#content").find("br").first().remove();
            }
        });
        $content.keyup(function(e){
            addContents(e);
            handleEmptyFigcaptions();
        });

        $title.keyup(function(e){
            if(isBackspaceKey(e.keyCode)){
                $("#title").find("*").each(function(){$(this).removeAttr("style")});
            }
        });

        $content.mouseleave(function(e){
            //ignore event from children, eg article contents
            var cont = $("#content");
            var px = cont.offset()["left"];
            var py = cont.offset()["top"];
            var width = cont.width();
            var height = cont.height();
            if (!((e.clientX > px) && (e.clientX < (px + width)) &&
                (e.clientY > py) && (e.clientY < (py + height)))) {
                $(".add-content-box").css("visibility", "hidden");
            }
            e.preventDefault();
            return false;
        });

        insertMediaPicker();
        addHoverListeners();

        /**
         * Add style to text (with appearing style toolbox)
         */
        $("div.options").find("button").on("click",function(){ article.note_changed(); });

        /**
         * Remove image in text
         */
        $articleText.delegate("img", "mouseover", function(event) {
            $(".remove-image-link").remove();
            mouse_over_item = true;
            var $img = $(this);
            var $figure = $img.parent();
            $('<a class="remove-image-link">Remove image</a>')
                .appendTo("body")
                .css("position","absolute")
                .css("top",$img.offset().top + $("body").scrollTop())
                .css("left",$img.offset().left + $img.width() + 12)
                .css("z-index", 3000)
                .click(function() {
                    $figure.remove();
                    $(this).remove();
                });
        });
        $articleText.delegate("img", "mouseout", function(event) {
            hideRemoveImageLinkSoon();
        });
        $("body").delegate(".remove-image-link", "mouseover", function(event) {
            mouse_over_item = true;
        });
        $("body").delegate(".remove-image-link", "mouseout", function(event) {
            hideRemoveImageLinkSoon();
        });

        var $add_img_field = $(".add-content-box #post_media");
        var $add_img_form = $add_img_field.parent();

        $add_img_field.unbind("change").change(function(e) {
            waiting_for_media_add = true;
            var $img = $('<img />').insertAfter($("#upcoming_image"));
            media_selector_potentially_open = false;
        
            article.save(function() {
                var file = e.dataTransfer !== undefined ? e.dataTransfer.files[0] : e.target.files[0];

                cropper.prompt_crop_image(file, {
                    scaleWidth: 650
                }, function(file_data) {
                    $img.attr("src",file_data);
                    $img.css("opacity", 0.5);

                    var form_data = new FormData($add_img_form[0]);
                    form_data.append("post[media]", base64_to_blob(file_data), "article-image");

                    $.ajax({
                        url: $add_img_form.attr('action'),
                        type: $add_img_form.attr('method'),
                        data: form_data,
                        processData: false,
                        contentType: false,
                        success: function(data) {
                            $img.attr("src",data.image_url);
                            article.save();
                            $img.css("opacity", 1);
                            waiting_for_media_add = false;
                        },
                        error: function() {
                            $.d_modal("Failed to add image :( - please try again.");
                            $img.remove();
                            waiting_for_media_add = false;
                        }
                    });
                });
            });
            e.preventDefault();
            return false;
        });

        $("#imgbutton").click(function() {
            media_selector_potentially_open = true;
        });
    });

    function firstIsParagraph() {
        return $("#content").html().substring(0,3) == "<p>";
    }

    function firstIsBr() {
        return $("#content").html().substring(0,4) == "<br>";
    }

    function hideRemoveImageLinkSoon() {
        mouse_over_item = false;
        setTimeout(function() {
            if(!mouse_over_item)
                $(".remove-image-link").remove();
        }, 2000);
    }

    /**
     * Figcaptions should be emptyable
     */
    function handleEmptyFigcaptions() {
        $("figcaption").each(function(i,e) {
            var $cap = $(e);
            if($cap.text().trim() == "") {
                $cap.addClass("empty").text("");
            }
            else {
                $cap.removeClass("empty");
            }
        });
    }

    function addHoverListeners() {
        $(".secondary-content-slot").each(function(i,e) {
            var hovered_slot = false, hovered_bar = false;

            function removePlaceHereInABit() {
                setTimeout(function() {
                    if(!hovered_slot && !hovered_bar && !media_selector_potentially_open && !waiting_for_media_add) {
                        $("#upcoming_image").remove();
                    }
                }, 200);
            }

            var $thisSlot = $(this);
            $thisSlot.mouseover(function() {
                if(waiting_for_media_add) return;

                hovered_slot = true;

                var hoverElem = $(this);

                if(hoverElem.id != null) {elemInit();}

                $("#upcoming_image").remove();
                var $placeHere = $("<img id='upcoming_image' />");
                hoverElem.before($placeHere);
                var ofs = $placeHere.offset();
                $placeHere.hide();

                var offset = ofs.top;
                if (isFirefox()) {
                    console.log("is firefox");
                    offset += 22;
                }

                $(".add-content-box")
                    .css("visibility", "visible")
                    .offset({top: offset, left: ofs.left})
                    .show();

                $("#imgform").attr("contenteditable", "false");
            });
            $(".add-content-box").mouseover(function() {
                hovered_bar = true;
            });
            $(".add-content-box").mouseout(function() {
                if(waiting_for_media_add) return;
                hovered_bar = false;
                removePlaceHereInABit();
            });
            $thisSlot.mouseout(function() {
                if(waiting_for_media_add) return;
                hovered_slot = false;
                removePlaceHereInABit();
            });
        });
    }

    function mediaPickerHtml(){
        return "<div contenteditable='false' class='secondary-content-slot'>&nbsp;</div>";
    }

    function insertMediaPicker() {
        $("#content").find("p").each(function(i, e){
            if (!$(e).next().hasClass("secondary-content-slot") ) {
                $(e).after(mediaPickerHtml());
            }
        });
    }

    function sanitize(content){
      //Hmm, sanitizing
      //TODO: This was called but not defined. Do we need to do something intelligent?
    }

    var enter_clicks_in_a_row = 0;
    function addContents(e) {
        $(".add-content-box").css("visibility", "hidden");

        if(isEnterKey(e.keyCode)) {
            if(++enter_clicks_in_a_row > 1) {
                enter_clicks_in_a_row = 0;
                document.execCommand('formatBlock', false, 'p');
            }

            insertMediaPicker();
            addHoverListeners();

            e.preventDefault();
        }
        else if(isBackspaceKey(e.keyCode)) {
            // Unoptimal solution for fixing webkit shortcomings
            $("#content").find("*").each(function(){$(this).removeAttr("style")});
            removeDuplicateMediaPickers();
        }
        else {
            enter_clicks_in_a_row = 0;
        }

        sanitize($("#content"));
    }

    function isEnterKey(keyCode) {
        return keyCode == 13;
    }

    function isBackspaceKey(keyCode) {
        return keyCode == 8;
    }

    function removeDuplicateMediaPickers() {
        $(".secondary-content-slot").each(function(i,e) {
            if($(e).next().hasClass("secondary-content-slot"))
                $(e).remove();
        });
    }

    function isFirefox(){
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

})(jQuery);
