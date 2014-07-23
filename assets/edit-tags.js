var tags = (function($) {

    var $main_tag = $(".title h1");

    $(document).ready(function() {
        makeTagsModifiable();
        addNewTag();

        if(!groupExists()) {
            addEmptyGroup();
        }

        makeGroupEditable();

        if($main_tag.text() == "")
            $main_tag.addClass("empty");
    });

    function makeTagsModifiable() {
        makeTagModifiable($(".tag"));
    }

    function makeTagModifiable($tag) {
        $tag.bind("click",editTag).attr("href",null);
        $('<span class="glyphicon glyphicon-remove"></span>').appendTo($tag).bind("click",removeTag);
    }

    function editTag() {
        setNextTag($(this));
    }

    function setNextTag($tag) {
        if(!$tag.hasClass("next-tag")) {
            $(".next-tag").tooltip("hide").remove();
        }

        $tag.find('.glyphicon').remove();

        $tag
            .attr("contenteditable",true)
            .addClass("next-tag")
            .addClass("empty")
            .removeClass("tag")
            .addClass("edit-field")
            .focus();

        $tag.keydown(tagKeydown);
        setUpEditField($tag);

        if($(".tag").length == 0){
            //TODO: first and next tag should not be mutually exclusive (watch out for the less when fixing, though)
            $tag.addClass("first-tag");
            $tag.removeClass("next-tag");
        }
    }

    function removeTag() {
        $(this).parent(".tag").tooltip("hide").remove();

        setMainTag($(".tag:first").text());

        $(".next-tag").tooltip("hide").remove();
        addNewTag();

        article.note_changed();
    }

    function addNewTag() {
        //Block addition of 5th tag
        if ($(".tag").length > 3) {
            return false;
        }

        $(".tags").append(" ");

        var $new_tag = $("<a></a>");
        $new_tag.appendTo(".tags");

        setNextTag($new_tag);

        return $new_tag;
    }

    function tagKeydown(event) {
        var $this_tag = $(this);
        
        $this_tag.removeClass("invalid").tooltip("hide");

        if(event.which == 188 || event.which == 13) {
            if(tagWithTextExists($this_tag.text())) {
                event.preventDefault();
                tagInvalid($this_tag, "Identical to already added tag");
                return false;
            }
            if($this_tag.text().trim() == "") {
                event.preventDefault();
                tagInvalid($this_tag, "Tag cannot be empty");
                return false;
            }

            solidifyTag($this_tag);

            //Add new tag
            var $next_tag = addNewTag();
            $next_tag.focus();

            event.preventDefault();
            return false;
        }
        else if($this_tag.text().length > 15 && event.which != 8){
            //Limit length of tag name to at most 16 characters
            event.preventDefault();
            tagInvalid($this_tag, "Max 16 characters");
            return false;
        }
    }

    function tagWithTextExists(text) {
        var has_tag = false;
        $(".tag").each(function() {
            if($(this).text() === text) {
                has_tag = true;
                return false;
            }
        });
        return has_tag;
    }

    function solidifyTag($tag) {
        $tag.removeClass("next-tag")
            .removeClass("edit-field")
            .removeClass("first-tag")
            .addClass("tag")
            .attr("contenteditable","false")
            .unbind("keydown keyup keypress");
        makeTagModifiable($tag);

        setMainTag($(".tag:first").text());
        
        article.note_changed();
    }

    function setMainTag(text) {
        $main_tag.text(text);

        if(text != "")
            $main_tag.removeClass("empty");
        else
            $main_tag.addClass("empty");
    }

    function groupExists() {
        return $(".tags .group").length > 0;
    }

    function makeGroupEditable() {
        $(".tags .group")
            .attr("href",null)
            .click(showGroupSelector);
    }

    function showGroupSelector(e) {
        e.preventDefault();
        var groups = loadGroups(function(groups) {
            var groups_list = renderGroups(groups);
            $(".group-selector-modal")
                .find(".modal-body")
                    .html(groups_list)
                .end()
                .modal("show");

            $(".group").addClass("empty");

            $(".group-pick").click(function() {
                var val = $(this).data("value");
                $(".group-selector-modal").modal("hide");
                $(".group").text(val);

                if(val == "") {
                    $(".group").addClass("empty");
                }
                else {
                    $(".group").removeClass("empty");
                }
            });
        });
        return false;
    }

    function loadGroups(callback) {
        $.ajax({
            url: "/readers/self/groups",
            type: "GET",
            dataType: "json",
            success: function(data) {
                callback(data);
            }
        });
    }

    function renderGroups(groups) {
        var html = '<a class="group-pick no-group" data-value="">none</a> ';
        $.each(groups, function(i, g) {
            html += '<a class="group-pick" data-value="'+g+'">'+g+'</a> ';
        });
        return html + '</div>';
    }

    function addEmptyGroup() {
        $('<a class="group empty"></a>').prependTo(".tags");
    }
    
    function tagInvalid($tag, msg) {
        $tag.addClass("invalid");
        tagTooltip($tag, msg);
    }
    
    function tagTooltip($tag, message) {
        console.log("tag msg: "+message);
        $tag.tooltip("destroy")
            .tooltip({
                placement: "right",
                trigger: "manual",
                title: message
            }).tooltip("show");
    }

    return {
        invalid: tagInvalid
    };
})(jQuery);
