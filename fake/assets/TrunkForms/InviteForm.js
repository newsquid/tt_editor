/// <reference path="vendor/jquery.d.ts"/>
/// <reference path="Form.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InviteForm = (function (_super) {
    __extends(InviteForm, _super);
    function InviteForm($form, defaultSettings) {
        _super.call(this, $form, defaultSettings);
        this.$inviteTableBody = this.find('.invite-table tbody');
        this.$submitButton = this.find(".invites-button");
        this.setUpSpinner(this.$inviteTableBody);
        this.setUpRemoveLink();
        this.EmailRegex = /^[^@]+@[^@]+\.[a-z]{2,3}$/i;

        //TODO: Submit form: make sure all invitees are added
        var thisForm = this;

        var $emailFields = this.getEmailFields();
        $emailFields.find('.recipient').keyup(function () {
            thisForm.refreshSubmitButtonState();
        });

        this.$emailField = $emailFields.first().clone().val('');

        this.enableAddRemove();

        //TODO: namespace all events
        this.off('submit');
        this.submit(function (event) {
            var emails = thisForm.getAllEmailFieldValues();
            if (thisForm.allEmailsAreValid(emails))
                thisForm.addInvitees(emails);

            event.preventDefault();
            return false;
        });

        this.refreshSubmitButtonState();
    }
    InviteForm.prototype.setUpSpinner = function ($inviteTableBody) {
        this.$spinner = $('<div class="spinner"></div>').css('margin-bottom', '-40px').appendTo($inviteTableBody);
    };

    InviteForm.prototype.setUpRemoveLink = function () {
        this.$removeLink = $('<a class="remove-link" title="Remove entry"><span class="glyphicon glyphicon-remove-sign"></span></a>');
    };

    InviteForm.prototype.getEmailFields = function () {
        //.parent() added to get the form control div, instead of the
        //  input field
        return this.find(".recipient").parent();
    };

    InviteForm.prototype.addInvitees = function (emails) {
        this.indicateThinking();
        this.sendInvites(emails);
    };

    InviteForm.prototype.sendInvites = function (emails) {
        var thisForm = this;

        this.asyncSubmit({
            data: [{ name: 'recipients', value: emails }],
            success: function () {
                if (typeof thisForm.defaultSettings.success !== "undefined")
                    thisForm.defaultSettings.success.apply(arguments);

                thisForm.indicateReady();
                thisForm.clearEmailFields();
            },
            error: function () {
                thisForm.indicateReady();
            }
        });
    };

    InviteForm.prototype.indicateThinking = function () {
        this.disable();
        this.disableAddRemove();
        this.$spinner.show();
    };

    InviteForm.prototype.indicateReady = function () {
        this.enable();
        this.enableAddRemove();
        this.$spinner.hide();
    };

    InviteForm.prototype.disableAddRemove = function () {
        this.find('.add-link, .remove-link').off('click');
    };

    InviteForm.prototype.enableAddRemove = function () {
        this.enableAdd(this.find('.add-link'));
        this.enableRemove(this.find('.remove-link'));
    };

    InviteForm.prototype.enableAdd = function ($clickable) {
        var thisForm = this;
        $clickable.click(function (event) {
            event.preventDefault();
            thisForm.addEmailField();
            return false;
        });
    };

    InviteForm.prototype.enableRemove = function ($clickable) {
        var thisForm = this;
        $clickable.click(function () {
            thisForm.animateOut($clickable.parent(), function () {
                $clickable.parent().remove();
                thisForm.closest(".notice, .d-modal-blocking").addClass("d-modal");
                console.log("fields matched: "+$clickable.parent().length);

                thisForm.refreshSubmitButtonState();
            });
        });
    };

    InviteForm.prototype.clearEmailFields = function () {
        this.find('.remove-link').click();
        this.find('.recipient').val('');
    };

    InviteForm.prototype.getAllEmailFieldValues = function () {
        var $emailFields = this.getEmailFields();
        return $emailFields.map(function () {
            return $(this).find('input').val();
        }).get();
    };

    InviteForm.prototype.addEmailField = function () {
        //TODO: Refactor: Extract EmailField as a class
        this.makeFieldRemovable(this.getEmailFields().last());
        this.setUpEmailField(this.$emailField.clone());
    };

    InviteForm.prototype.setUpEmailField = function ($field) {
        var thisForm = this;
        this.animateIn($field.insertAfter(this.getEmailFields().last()), function () {
            thisForm.refreshSubmitButtonState();
        });
        $field.find('.recipient').val('').keyup(function () {
            thisForm.refreshSubmitButtonState();
        });
        $field.find('.add-link').click(function () {
            thisForm.addEmailField();
        });
    };

    InviteForm.prototype.makeFieldRemovable = function ($field) {
        $field.find(".add-link").remove();
        this.closest(".notice, .d-modal-blocking").addClass("d-modal");

        var $newRemoveLink = this.$removeLink.clone();
        var thisForm = this;

        this.enableRemove($newRemoveLink.appendTo($field));
    };

    InviteForm.prototype.refreshSubmitButtonState = function () {
        if (this.allEmailsAreValid(this.getAllEmailFieldValues()))
            this.$submitButton.attr('disabled', false);
        else
            this.$submitButton.attr('disabled', true);
    };

    InviteForm.prototype.allEmailsAreValid = function (emails) {
        var thisForm = this;
        var emails_are_valid = true;

        this.find(".recipient").each(function () {
            if (!thisForm.isValidEmail($(this).val())) {
                $(this).addClass("invalid-email");
                emails_are_valid = false;
                return false;
            }

            $(this).removeClass("invalid-email");
        });
        return emails_are_valid;
    };

    InviteForm.prototype.isValidEmail = function (email) {
        return this.EmailRegex.test(email);
    };

    InviteForm.prototype.animateIn = function ($element, callback) {
        $element.hide().css('opacity', 0).animate({
            height: "show",
            "margin-top": "show",
            "margin-bottom": "show",
            "padding-top": "show",
            "padding-bottom": "show"
        }, 190, function () {
            $element.animate({
                opacity: 1
            }, 190, callback);
        });
    };

    InviteForm.prototype.animateOut = function ($element, callback) {
        $element.animate({
            height: "hide",
            "margin-top": "hide",
            "margin-bottom": "hide",
            "padding-top": "hide",
            "padding-bottom": "hide",
            opacity: "hide"
        }, callback);
    };
    return InviteForm;
})(Form);
//# sourceMappingURL=InviteForm.js.map
