define([ 'scribe',
          'scribe-plugin-blockquote-command',
          'scribe-plugin-toolbar',
          'scribe-plugin-heading-command',
          'scribe-plugin-link-prompt-command',
          'scribe-plugin-sanitizer',
          'scribe-plugin-tt-insert-image'],

  function (Scribe, scribePluginBlockquoteCommand, scribePluginToolbar,
            scribePluginHeadingCommand, scribePluginLinkPromptCommand,
            scribePluginSanitizer, scribePluginTTInsertImageCommand) {

  return function(scribeElement,toolbarElement){

    // Create an instance of Scribe
    var scribe = new Scribe(scribeElement);

    // Use some plugins
    scribe.use(scribePluginBlockquoteCommand());
    scribe.use(scribePluginHeadingCommand(2));
    scribe.use(scribePluginHeadingCommand(1));
    scribe.use(scribePluginLinkPromptCommand());
    scribe.use(scribePluginTTInsertImageCommand());
    scribe.use(scribePluginToolbar(toolbarElement));

    return {} // Public interface. OF NOTHINGNESS!!!!
  }
});
