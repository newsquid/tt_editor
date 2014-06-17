define([ 'scribe',
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

  return function(scribeElement,toolbarElement,mediabarElement,addImageFunction){

    // Create an instance of Scribe
    var scribe = new Scribe(scribeElement);

    // Use some plugins
    scribe.use(scribePluginBlockquoteCommand());
    scribe.use(scribePluginHeadingCommand(2));
    scribe.use(scribePluginHeadingCommand(1));
    scribe.use(scribePluginLinkPromptCommand());
    scribe.use(scribePluginToolbar(toolbarElement));
    scribe.use(scribePluginHoverToolbar(toolbarElement));
    scribe.use(scribePluginImageParagraphs(mediabarElement,addImageFunction));

    return {} // Public interface. OF NOTHINGNESS!!!!
  }
});
