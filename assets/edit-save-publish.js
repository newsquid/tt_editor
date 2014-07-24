//Default publish settings
var publish_settings = {
    is_published: false
};

var saving_status = (function() {
    var $saving_status = $(".saving-status");
    
    var set_status = function(status) {
        $saving_status.removeClass("modified saving saved not-saved publishing published not-published unpublishing unpublished not-unpublished");
        $saving_status.addClass(status);
    }
    
    return {
        blank: function() {
            set_status("");
        },
        modified: function() {
            set_status("modified");
        },
        saving: function() {
            set_status("saving");
        },
        saved: function() {
            set_status("saved");
        },
        notSaved: function() {
            set_status("not-saved");
        },
        publishing: function() {
            set_status("publishing");
        },
        published: function() {
            set_status("published");
        },
        notPublished: function() {
            set_status("not-published");
        },
        unpublishing: function() {
            set_status("unpublishing");
        },
        unpublished: function() {
            set_status("unpublished");
        },
        notUnpublished: function() {
            set_status("not-unpublished");
        }
    };
})();

//Merge into publish settings
function setUpSaveAndPublish(settings) {
    publish_settings = settings;
}

var article = (function($) {
    var $publish_button = $(".publish-button");
    $(document).ready(function() {
        if(publish_settings.is_published) {
            showPublishedHeader();
        }
        else {
            showUnpublishedHeader();
        }

        setUpSaving();
        setUpPublishing();
    });

    function setUpSaving() {
        $(".edit-article").delegate(".edit-field:not(.group):not(.first-tag):not(next-tag)","keyup",function(e) {
            if (!isArrowKey(e.keyCode)) {
                noteArticleChanged();
            }
        });

        intervalSave(4000, save_success, save_failure);
    }

    function setUpPublishing() {
        $("#publish-button, #publish-changes-button").click(publish);
        $("#unpublish-button").click(innerUnpublish);
        $("#discard-changes-button").click(showDiscardConfirmation);
    }

    function showPublishedHeader() {
        $publish_button.addClass("published");
    }

    function showUnpublishedHeader() {
        $publish_button.removeClass("published");
    }

    function isArrowKey(keyCode) {
        return keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40;
    }

    function publish() {
        save(function() {
            save_success();
            innerPublish();
        }, function(message) {
            save_failure(message);
        });
    }

    function unpublish() {
        showUnpublishedHeader();

        save(function() {
            save_success();
            innerUnpublish();
        }, function(message) {
            save_failure(message);
            showPublishedHeader();
        });
    }

    var article_updated = false;
    var save_i = -1;

    /**
     * Saves the content of the form every <time> seconds
     * success_callback - called on every save success
     * fail_callback - called on every save failure
     */
    function intervalSave(time, success_callback, fail_callback) {
        setTimeout(function () {
            if (article_updated) {
                article_updated = false;
                
                save(success_callback, fail_callback);
            }
            intervalSave(time, success_callback, fail_callback);
        }, time);
    }

    function save_success() {
        if (!article_updated) {
            saving_status.saved();
        }
    }

    function save_failure(message) {
        if (!article_updated) {
            saving_status.notSaved();
        }
    }

    function publish_success() {
        if (!article_updated) {
            saving_status.published();
        }
    }

    function publish_failure(message) {
        if (!article_updated) {
            saving_status.notPublished();
        }
    }

    function innerPublish(success_callback, failure_callback) {
        //Default callbacks
        if(typeof success_callback === "undefined") success_callback = function() {};
        if(typeof fail_callback === "undefined") fail_callback = function() {};

        saving_status.publishing();

        submitPostForm({
            published: true
        }, function(d, s, jqXHR) {
            setPublishedNow();
            saving_status.published();

            success_callback();
        }, function(jqXHR, text, error) {
            console.log("Failed to publish.");
            console.log(jqXHR);

            saving_status.notPublished();

            fail_callback();
        });
    }

    /**
     * Validates the article, checking that all the required fields
     * have been filled. Returns boolean.
     * Side-effect: marks invalid fields
     */
    function isArticleValid() {
        var valid = true;

        //Title
        var $title = $("#title");
        if($title.val().trim() == "") {
            titleInvalid("You must fill in a title");
            valid = false;
        }

        //Main tag
        var $main_tag = $(".title h1");
        if($main_tag.text() == "") {
            tags.invalid($(".first-tag"), "You must fill in a main tag");
            valid = false;
        }

        //Message text
        var $main_text = $("#content");
        if($main_text.text().trim() == "") {
            mainTextInvalid("You must write something before you can publish it.");
            valid = false;
        }

        return valid;
    }

    function titleInvalid(message) {
        $("#title").addClass("invalid")
                   .tooltip("destroy")
                   .tooltip({
                       placement: "top",
                       trigger: "manual",
                       title: message
                   })
                   .tooltip("show");
    }

    function mainTextInvalid(message) {
        $("#content").addClass("invalid")
                     .tooltip("destroy")
                     .tooltip({
                        placement: "top",
                        trigger: "manual",
                        title: message
                     })
                     .tooltip("show");
    }

    function innerUnpublish() {
        saving_status.unpublishing();
        showUnpublishedHeader();

        submitPostForm({
            published: false
        }, function(d, s, jqXHR) {
            saving_status.unpublished();
        }, function(jqXHR, text, error) {
            saving_status.notUnpublished();
            showPublishedHeader();
        });
    }

    function setPublishedNow() {
        setPublishDate(new Date(Date.now()));
        showPublishedHeader();
    }

    function setPublishDate(date) {
        $(".last-publish-date").text(dateString(date));
    }

    function dateString(date) {
        return twoDigits(date.getHours()) + ":" +
            twoDigits(date.getMinutes()) + " " +
            twoDigits(date.getDate()) + "-" +
            twoDigits(date.getMonth()) + "-" +
            date.getFullYear();
    }

    function twoDigits(digits) {
        return digits < 10 ? "0" + digits : digits;
    }

    /**
     * Saves the form. calls success_callback on success, fail_callback
     * on error.
     */
    function save(success_callback, fail_callback) {
        //Default callbacks
        if(typeof success_callback === "undefined") success_callback = function() {};
        if(typeof fail_callback === "undefined") fail_callback = function() {};

        var this_save_i = ++save_i;
        
        saving_status.saving();

        submitPostForm({
            tag_list: tagsAsCommaSeparatedString(),
            channel: $("#channel").val(),
            published: "noop",
            price: $(".settings-price-picker").val(),
            group: $(".group").text(),
            main_img_caption: $("#main_img_caption").text(),
            title: $("#title").val(),
            content: cleanEditorHtml($("#content").html())
        }, function (d, textStatus, jqXHR) {
            if (this_save_i == save_i) {
                saving_status.saved();
                removeConfirmOnPageExit();
                success_callback();
            }
        }, function (jqXHR, textStatus, errorThrown) {
            // Clear previous errors
            $(".dismiss").click();

            if (this_save_i == save_i) {
                saving_status.notSaved();

                fail_callback(messageFromXhr(jqXHR));
            }
        });
    }

    //TODO: Unuglify, plez
    function messageFromXhr(xhr) {
        if(xhr !== undefined && xhr !== null) {
            if(xhr.responseJSON !== undefined &&
                    xhr.responseJSON !== null) {
                if(xhr.responseJSON.message !== undefined &&
                        xhr.responseJSON.message !== null) {
                    return xhr.responseJSON.message;
                }
            }
        }
        return null;
    }

    function submitPostForm(values, success_callback, error_callback) {
        var form = $("#post-form").clone();

        var dat = form.serializeArray();
        pushFormValuesToData(dat, values);

        $.ajax({
            type: form.attr("method"),
            url: form.attr("action"),
            data: dat,
            success: success_callback,
            error: error_callback
        });
    }

    function cleanEditorHtml(html) {
        return html
            .trim()
            .replace("<br></p>","</p>")
            .replace(/<div[^>]*>[^<]*<\/div>/ig,"");
    }

    function pushFormValuesToData(form_data, values) {
        $.each(values, function(key, value) {
            form_data.push({
                "name": key,
                "value": value
            });
        });
    }

    function tagsAsCommaSeparatedString() {
        return list = $(".tag").map(function(i,t) {
            return $(t).text();
        }).get().join();
    }

    function noteArticleChanged() {
        article_updated = true;
        registerConfirmOnPageExit();
        saving_status.modified();
    }

    function discardChanges(discard_link) {
        $.ajax({
            type: "delete",
            url: discard_link,
            success: function (d, textStatus, jqXHR) {
                location.replace(d.redirect);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.d_modal("Discard failed.");
                $.d_modal(errorThrown);
            }
        });

        event.preventDefault();
        return false;
    }

    var confirmOnPageExit = function(e) {
        e = e || window.event;
        var message = "You have unsaved changes in your document.";

        //Support old browsers
        if(e) {
            e.returnValue = message;
        }

        return message;
    }

    function registerConfirmOnPageExit() {
        window.onbeforeunload = confirmOnPageExit;
    }

    function removeConfirmOnPageExit() {
        window.onbeforeunload = null;
    }

    function showDiscardConfirmation(){
        var $modal = $.d_modal('<h2>Discard changes?</h2><p>This will roll back your edits to the currently published version.</p>');
        $modal.appendTo("body");
        $('<button class="btn btn-default small">Discard</button>')
            .appendTo($modal)
            .click(function() {
                discardChanges(publish_settings.discard_link);
            });
        $(".discard-confirm").show();
    }

    //Expose functions that may be used elsewhere.
    return {
        note_changed: noteArticleChanged,
        save: save,
        publish: innerPublish,
        unpublish: innerUnpublish,
        isValid: isArticleValid
    };

})(jQuery);
