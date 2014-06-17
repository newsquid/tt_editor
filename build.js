({
    baseUrl: 'src/scripts/components',
    mainConfigFile: 'src/scripts/main.js',

    paths: {
      'scribe': 'scribe/scribe',
      'scribe-plugin-blockquote-command' : 'scribe-plugin-blockquote-command/scribe-plugin-blockquote-command',
      'scribe-plugin-toolbar' : 'scribe-plugin-toolbar/scribe-plugin-toolbar',
      'scribe-plugin-heading-command' : 'scribe-plugin-heading-command/scribe-plugin-heading-command',
      'scribe-plugin-link-prompt-command' : 'scribe-plugin-link-prompt-command/scribe-plugin-link-prompt-command',
      'scribe-plugin-sanitizer' : 'scribe-plugin-sanitizer/scribe-plugin-sanitizer',
      'scribe-plugin-image-paragraphs' : 'scribe-plugin-image-paragraphs/scribe-plugin-image-paragraphs',
      'scribe-plugin-hover-toolbar' : 'scribe-plugin-hover-toolbar/scribe-plugin-hover-toolbar'
    },

    include: ['../main'],
    name: 'almond/almond'
})
