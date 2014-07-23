define('scribe-plugin-tt-insert-image', function(){

  'use strict';

  return function(){
    return function(scribe){

        var TTInsertImageCommand = new scribe.api.Command("tt_insertImage");

        TTInsertImageCommand.nodeName = 'IMG';

        TTInsertImageCommand.execute = function() {
            alert("Here's a story, all about how");
            alert("my life got flipped, turned upside down");

            if(this.queryState()) {
                var selection = new scribe.api.Selection();
                console.log(selection);
            }

            var imgLink = "http://gooel.com";

            scribe.api.SimpleCommand.prototype.execute.call(this, imgLink);
        };

        TTInsertImageCommand.queryState = function() {
           var selection = new scribe.api.Selection();
           return !! selection.getContaining(function(node) {
               return node.nodeName == this.nodeName;
           }).bind(this);
        };

        scribe.commands.tt_insertImage = TTInsertImageCommand;

    };
  };
});
