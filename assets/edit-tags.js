(function($) {

    var $main_tag = $(".title h1");

    $(document).ready(function() {
        makeTagsModifiable();
        addNewTag();

        if(groupExists()) {
            makeGroupEditable();
        }
        else {
            addEmptyGroup();
            makeGroupEditable();
        }

        if($main_tag.text() == "")
            $main_tag.addClass("empty");

        // don't navigate away from the field on tab when selecting an item in dropdown (jQuery UI)
        $("#taglist").bind( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB ) {
                event.preventDefault();
            }
            if ( event.keyCode === $.ui.keyCode.ENTER ) {
                var elem = $("#taglist");
                elem.text("," + elem.html().trim());
                event.preventDefault();
            }
        });
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
        if(!$tag.hasClass("next-tag"))
            $(".next-tag").remove();

        $tag.find('.glyphicon').remove();

        $tag
            .attr("contenteditable",true)
            .addClass("next-tag")
            .removeClass("tag")
            .addClass("edit-field")
            .focus();

        makeTagAutocompleteable($tag);
        $tag.keydown(tagKeydown);
        setUpEditField($tag);

        if($(".tag").length == 0){
            //TODO: first and next tag should not be mutually exclusive (watch out for the less when fixing, though)
            $tag.addClass("first-tag");
            $tag.removeClass("next-tag");
        }
    }

    function removeTag() {
        $(this).parent(".tag").remove();

        if($(".tag").length == 0){
            setMainTag("");
        }

        $(".next-tag").remove();
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

    function makeTagAutocompleteable($tag){
        $tag.autocomplete({
            source: function( request, response ) {
                $.getJSON("/tags", {
                    term: request.term
                }, response );
            },
            search: function() {
                // custom minLength
                var term = $(this).html();
                if ( term.length < 1 ) {
                    return false;
                }
            },
            focus: function() {
                // prevent value inserted on focus
                return false;
            },
            select: function( event, ui ) {
                $(this).html(ui.item.value);
                return false;
            }
        });
    }

    function tagKeydown(event) {
        var $this_tag = $(this);

        if(event.which == 188 || event.which == 13) {
            if(tagWithTextExists($this_tag.text())) {
                event.preventDefault();
                return false;
            }

            solidifyTag($this_tag);

            //TODO: Maybe figure out how to move noticing of article state change out of here
            // (as this doesn't have anything directly to do with the tag functionality).
            article.note_changed();

            //Add new tag
            var $next_tag = addNewTag();
            $next_tag.focus();

            event.preventDefault();
            return false;
        }
        else if($this_tag.text().length > 15 && event.which != 8){
            //Limit length of tag name to at most 16 characters
            event.preventDefault();
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
            .attr("contenteditable","false");
        makeTagModifiable($tag);
        //TODO: Click: edit; click cross: delete

        if ($(".tag").length == 1) {
            setMainTag($tag.text());
        }
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
            .addClass("edit-field")
            .attr("contenteditable",true);
    }

    function addEmptyGroup() {
        $('<a class="group empty"></a>').prependTo(".tags");
    }
})(jQuery);
