var deleteClick = function() {
    var $this = $(this);
    var $row = $this.parent().parent();
    var groupId = $row.attr("data-group-id");
    promptDeleteGroupRow($row, groupId);
};

var removeMember = function() {
    var $this = $(this);
    var $row = $this.parent().parent();
    var memberId = $row.attr("data-member-id");
    var groupId = $row.parent().parent().parent().parent().attr("data-group-id");
    promptDeleteMemberRow($row, groupId, memberId);
};

var confirmRow = function(cols, confirm_text) {
    return '<tr><td colspan="'+cols+'" class="blocking-row"><button class="btn btn-primary cancel">Cancel</button> <button class="btn btn-default confirm">'+confirm_text+'</button></td></tr>';
}
function promptDeleteGroupRow($row, groupId) {
    promptDeleteRow($row, 7, "Leave group", function($row,$confirmRow) {
        //Async delete group
        $.ajax({
            url: "/groups/"+groupId+"/leave",
            success: function() {
                $confirmRow.remove();
            },
            error: function() {
                console.log("Failed to leave group...");
            }
        });
    });
}

function promptDeleteMemberRow($row, groupId, memberId) {
    promptDeleteRow($row, 2, "Remove", function($row,$confirmRow) {
        $.ajax({
            url: "/groups/"+groupId+"/remove/"+memberId,
            success: function() {
                //If last element, refresh page
                if($confirmRow.parent().find('tr').length == 1)
                    location.reload();
                $confirmRow.remove();
            },
            error: function() {
                console.log("Failed to remove member...");
            }
        });
    });
}

function promptDeleteRow($row, cols, confirm_text, confirm_action) {
    var $confirmRow = $(confirmRow(cols, confirm_text));
    $row.after($confirmRow).remove();
    $confirmRow
        .find('.cancel')
        .bind("click", function() {
            //Re-insert old row
            $confirmRow.after($row).remove();
            $row.find('.delete').click(deleteClick);
        })
        .end()
        .find('.confirm')
        .bind("click", function() {
            confirm_action($row,$confirmRow);
        });
}

$(document).ready(function() {
    /* Leave Group */
    $(".group-list .delete").click(deleteClick);

    /* Remove member from group */
    $(".modal-table .delete").click(removeMember);

    /* Manage Group button click */
    $(".manage-group").click(function() {
        var $this = $(this);
        var groupId = $this.parent().parent().attr("data-group-id");
        console.log("Managing group #"+groupId);

        $.ajax({
            url: "/groups/"+groupId+"/manage",
            success: function(data) {
                var $modal = $.d_modal(data, { blocking: true });
                $modal.attr("data-group-id", groupId);
                var $form = $modal.find('.invite_list_form');

                var invite_form = new InviteForm($form, {
                    success: function(data) {
                        addEmailsToInviteeList($modal, invite_form.getAllEmailFieldValues());
                    }
                });

                //Bind member removal
                $modal.find('.delete').click(removeMember);
            }
        });
    });
});
