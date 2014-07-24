define('scribe-plugin-tt-insert-image', function(){

  'use strict';

  return function(loadImageUrl){
    return function(scribe){

        var TTInsertImageCommand = new scribe.api.Command("insertHTML");

        TTInsertImageCommand.nodeName = 'IMG';

        TTInsertImageCommand.execute = function() {
            var thisInsertImageCommand = this;

            // loadImageUrl is fed to scribe, and is a function which loads
            // the image that should be added (by prompting the user, or
            // something like that). The function should take a callback,
            // which is this plugin's way of actually inserting the image
            // into the text area.
            //   The plugin inserts the image (with the src provided) and
            // then feeds the resulting image DOM element to its own
            // callback, allowing the user of the plugin to do some post-
            // processing of it.
            loadImageUrl(function(imageUrl, callback) {
                if(callback === undefined) callback = function(img) {};

                scribe.api.SimpleCommand.prototype.execute.call(thisInsertImageCommand, "</p><img src='"+imageUrl+"' id='tt-insert-most-recent-image'><p>");
                var img = document.getElementById("tt-insert-most-recent-image");
                img.id = "";

                callback(img);
            });
        };

        TTInsertImageCommand.queryState = function() {
           var selection = new scribe.api.Selection();
           return !! selection.getContaining(function(node) {
               return node.nodeName == this.nodeName;
           }.bind(this));
        };

        scribe.commands.tt_insertImage = TTInsertImageCommand;

    };
  };
});
