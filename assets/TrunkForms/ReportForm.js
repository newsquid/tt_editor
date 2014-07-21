/// <reference path="vendor/jquery.d.ts" />
/// <reference path="Form.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ReportForm = (function (_super) {
    __extends(ReportForm, _super);
    function ReportForm($form, defaultSettings) {
        _super.call(this, $form, defaultSettings);

        this.$reportMessageField = this.find('textarea');
        this.$submitButton = this.find('button');

        this.setUpReportMessageField();
    }
    ReportForm.prototype.setUpReportMessageField = function () {
        var thisForm = this;

        this.$reportMessageField.keyup(function () {
            if ($(this).val() != "")
                thisForm.$submitButton.attr('disabled', false);
            else
                thisForm.$submitButton.attr('disabled', true);
        });
    };
    return ReportForm;
})(Form);
//# sourceMappingURL=ReportForm.js.map
