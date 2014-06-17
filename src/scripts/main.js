require([ 'scribe',
          'scribe-plugin-blockquote-command',
          'scribe-plugin-toolbar',
          'scribe-plugin-heading-command',
          'scribe-plugin-link-prompt-command',
          'scribe-plugin-sanitizer',
          'scribe-plugin-image-paragraphs',
          'scribe-plugin-hover-toolbar'],

  function (Scribe, scribePluginBlockquoteCommand, scribePluginToolbar,
            scribePluginHeadingCommand, scribePluginLinkPromptCommand,
            scribePluginSanitizer, scribePluginImageParagraphs,
            scribePluginHoverToolbar) {

  var scribeElement = document.querySelector('.scribe');

  // Create an instance of Scribe
  var scribe = new Scribe(scribeElement);

  // Use some plugins
  scribe.use(scribePluginBlockquoteCommand());
  scribe.use(scribePluginHeadingCommand(2));
  scribe.use(scribePluginHeadingCommand(1));
  scribe.use(scribePluginLinkPromptCommand());
  //scribe.use(scribePluginSanitizer({ tags: {
  //  p: {},
  //  b: {},
  //  i: {},
  //  br: {},
  //  li: {},
  //  h1: {},
  //  h2: {},
  //  a: {}
  //}}));

  var toolbarElement = document.querySelector('.toolbar');
  scribe.use(scribePluginToolbar(toolbarElement));

  function addImage(event,element){
    var image = document.getElementById("an-image");
    element.parentNode.insertBefore(image,element);
  }

  scribe.use(scribePluginHoverToolbar(toolbarElement));
  scribe.use(scribePluginImageParagraphs(document.getElementById('media-bar'),addImage));
});
