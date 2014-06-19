    function isEmpty(accessor) {
        return $.trim($(accessor).text()) == "";
    }
    function initEditField(accessor) {
        $(accessor).attr("contenteditable","true")
            .addClass("edit-field");
        if(isEmpty(accessor))
            $(accessor).addClass("empty");
    }

    function msgChanged() {
        $("#message").removeClass("alert-success")
            .removeClass("alert-error")
            .addClass("alert-warning")
            .text("Unsaved changes.");
    }
    function msgSaving() {
        $("#message").removeClass("alert-success")
            .removeClass("alert-danger")
            .addClass("alert-warning")
            .text("Saving...");
    }
    function msgSaved() {
        $("#message").removeClass("alert-warning")
            .removeClass("alert-danger")
            .addClass("alert-success")
            .text("Saved.");
    }
    function msgFailed() {
        $("#message").removeClass("alert-warning")
            .removeClass("alert-success")
            .addClass("alert-danger")
            .text("Save failed.");
    }


    function save() {
      /* Save form data through ajax. 
          Redirect is boolean indicating if we should redirect to the 
          post afterwards. This is generally the case for button press,
          but not auto-save */

        var form = $("#reader-form").clone();

       msgSaving();
       $("#message").show();

       var dat = form.serializeArray();
       $(".edit-field").each(function(){
           var e = $(this);
           dat.push({
               "name":e.attr("data-field-name"),
               "value":e.html()
           });
       });

       $.ajax({
           type: form.attr("method")
           ,url: form.attr("action")
           ,data: dat
           ,success: function(d, textStatus, jqXHR){
               msgSaved();
           },
           error: function(jqXHR, textStatus, errorThrown) {
               msgFailed();
           }
       });

    }

    var initReaderEdit = (function($) {
        return function() {
            initEditField("#author-name");
            initEditField("#author-email");
            initEditField("#author-title");
            initEditField("#author-bio");
            $(".edit-field").keydown(function() {
                msgChanged();
                $("#message").show();
            });

            $("#submit-button").click(save);
        };
    })(jQuery);

