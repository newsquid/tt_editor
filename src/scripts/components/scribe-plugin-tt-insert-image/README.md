# scribe-plugin-tt-insert-image

Adds functionality to add images to paragraphs for the 
[scribe editor](https://github.com/guardian/scribe)

## Guide

Add this repo to your bower.json. Use AMD to load the module, as per
scribe's guidelines. 

Then register and initialize this plugin with two arguments:
- And image-bar html element
- An add image function

"image-bar" must have as its first child element a clickable element,
for instance:

```html
<div id="media-bar" style="display:none">
  <a href="#">Add image</a>
</div>
```

The element will be shown when hovering over an empty paragraph and
empty otherwise

"add image function" will be given as it's arguments:
1. the click event
2. the paragraph where the click took place

The implementation of exactly inserting/uploading an image is left as
an exercise to the reader. A trivial example:

```javascript
function addImage(event,element){
    var image = document.getElementById("an-image");
    element.parentNode.insertBefore(image,element);
}
```

Putting it all the together with scribe. The plugin will registered
as:

```javascript
var scribeElement = document.querySelector('.scribe');
var scribe = new Scribe(scribeElement);

scribe.use(scribePluginImageParagraphs(document.getElementById('media-bar'),addImage));
```

## TODO
Add support for different media types than images (which would beg
a change of name)
