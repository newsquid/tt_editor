function addEmailsToInviteeList($modal, emails) {
    var $table = $modal.find('.modal-table.invitations-pending');
    var $tbody = $table.find('tbody');
    emails.forEach(function(val) {
        $('<tr><td>'+val+'</td></tr>').appendTo($tbody).hide().slideDown();
    });
}

(function($) {
    $(document).ready(function() {
        $(".invite_list_form").each(function() {
            new InviteForm($(this), {
                success: function(data) {
                    $(".invite_list_form").parent().trigger("dismiss");
                }
            });
        });
    });
})(jQuery);
