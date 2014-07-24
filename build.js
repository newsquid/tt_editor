({
    baseUrl: 'src/scripts',
    mainConfigFile: 'src/scripts/tt_editor.js',

    paths: {
      'scribe': 'components/scribe/scribe',
      'scribe-plugin-blockquote-command' : 'components/scribe-plugin-blockquote-command/scribe-plugin-blockquote-command',
      'scribe-plugin-toolbar' : 'components/scribe-plugin-toolbar/scribe-plugin-toolbar',
      'scribe-plugin-heading-command' : 'components/scribe-plugin-heading-command/scribe-plugin-heading-command',
      'scribe-plugin-link-prompt-command' : 'components/scribe-plugin-link-prompt-command/scribe-plugin-link-prompt-command',
      'scribe-plugin-sanitizer' : 'components/scribe-plugin-sanitizer/scribe-plugin-sanitizer',
      'scribe-plugin-tt-insert-image' : 'components/scribe-plugin-tt-insert-image/scribe-plugin-tt-insert-image'
    },

    include: ["tt_editor","components/almond/almond"]
})
