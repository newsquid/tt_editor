TARGET=tt_editor.js
RJS=./node_modules/.bin/r.js -o
BUILD_CONFIG=build.js

CSSS=$(wildcard src/css/*)

.PHONY: dependencies build surf

all: build

build: $(TARGET) style.css

$(TARGET): dependencies
	$(RJS) $(BUILD_CONFIG) optimize=none out=$(TARGET)

style.css: $(CSSS)
	cat src/css/* > style.css

dependencies:
	npm install
	node_modules/.bin/bower install

surf: build
	chromium `pwd`/index.html
