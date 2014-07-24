define('scribe-plugin-tt-insert-image', function(){

  'use strict';

  return function(loadImageUrl){
    return function(scribe){

        var TTInsertImageCommand = new scribe.api.Command("insertHTML");

        TTInsertImageCommand.nodeName = 'IMG';

        TTInsertImageCommand.execute = function() {
            var thisInsertImageCommand = this;

            console.log(loadImageUrl);
            
            loadImageUrl(function(imageUrl) {
                console.log(imageUrl);
                scribe.api.SimpleCommand.prototype.execute.call(thisInsertImageCommand, "</p><img src='"+imageUrl+"'><p>");
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
