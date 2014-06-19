/// <reference path="vendor/jquery.d.ts" />

/**
* Create a form
*/
var Form = (function () {
    function Form($form, defaultSettings) {
        $.extend(true, this, $form);

        if (typeof defaultSettings !== "undefined")
            this.defaultSettings = defaultSettings;
        else
            this.defaultSettings = {};

        var thisForm = this;

        //Set form submit to async submit
        this.submit(function (event) {
            thisForm.asyncSubmit();

            //Block normal event flow
            event.preventDefault();
            return false;
        });
    }
    /**
    * Asynchronously submit the form! The settings array is the same as
    * that provided to jQuery.ajax, but has been extended with:
    * - retry (Boolean): should submit automatically keep retrying until success?
    */
    Form.prototype.asyncSubmit = function (settings) {
        var options = $.extend({
            url: this.attr("action") || location.href,
            type: this.attr("method") || "GET",
            data: this.serializeArray(),
            retry: true
        }, this.defaultSettings);

        //Recursively merge found settings with given settings. Given settings
        // rule, and overwrite existing settings.
        if (typeof settings !== "undefined") {
            options = $.extend(true, options, settings, {
                //Overwrite error callback to retry submit!
                error: function () {
                    if (typeof settings.error !== "undefined")
                        settings.error.apply(arguments);

                    //Retry after interval
                    if (settings.retry) {
                        setTimeout(function () {
                            this.asyncSubmit(settings);
                        }, 2000);
                    }
                }
            });
        }

        $.ajax(options);
    };

    Form.prototype.disable = function () {
        var $form_controls = this.allControls();
        $form_controls.attr("disabled", true);
    };

    Form.prototype.enable = function () {
        var $form_controls = this.allControls();
        $form_controls.attr("disabled", false);
    };

    Form.prototype.allControls = function () {
        return this.find("input, textarea, select, button");
    };
    return Form;
})();
//# sourceMappingURL=Form.js.map
