default: launch-chromium

launch-chromium: dependencies
	chromium `pwd`/index.html

dependencies:
	rm -rf scripts/components/scribe-plugin-image-paragraphs
	bower install
