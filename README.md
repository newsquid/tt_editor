#TT-editor
The editor for [TrunkTrunk](http://trunktrunk.org)

**NOTE:** `tt_editor.js` is built from `src/scripts/tt_editor.js`. Make sure you edit the right file.

## Usage

See index.html for example usage. In general, include "tt_editor.js"
and initialize the (AMD) component in a manner similar to:

```javascript
require(["tt_editor"],function(tt_editor){

  var scribeElement = document.querySelector('.content');
  var toolbarElement = document.querySelector('.toolbar');
  var mediabarElement = document.getElementById('media-bar');

  function addImage(event,element){
    var image = document.getElementById("an-image");
    element.parentNode.insertBefore(image,element);
    /* Or, alternatively, a more clever and useful approach */
  }

  var tte = new tt_editor(scribeElement,toolbarElement,mediabarElement,addImage);
});
```
