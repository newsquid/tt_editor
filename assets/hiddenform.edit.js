$(document).ready(function() {
  $(".media_form").each(function() {
    var $form = $(this);
    var $realupload = $form.find('input[type=file]');
    $(this).find(".trigger").click(function(event) {
        event.preventDefault();
        $realupload.click();
        return false;
    });
    $realupload.change(function(e) {
        $form.submit();
    });
  });
});
