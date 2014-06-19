var setUpEditField = (function($) {

    function setUpEditField($editField) {
        $editField
            .keyup(editFieldKeyup)
            .keydown(editFieldKeydown);
    }

    function editFieldKeyup() {
        if($(this).text() == "") {
            $(this).addClass("empty");
            $(this).text("");
        }
        else {
            $(this).removeClass("empty");
        }
    }

    function editFieldKeydown(event) {
        if(event.keyCode != 8 &&
           event.keyCode != 16 &&
           event.keyCode != 17 &&
           event.keyCode != 18) {
           $(this).removeClass("empty");
        }
    }

    $(document).ready(function() {
        setUpEditField($(".edit-field"));
    });

    return setUpEditField;

})(jQuery);