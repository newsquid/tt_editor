TARGET=tt_editor.js
RJS=./node_modules/.bin/r.js -o
BUILD_CONFIG=build.js

.PHONY: dependencies build surf

all: build

build: $(TARGET)

$(TARGET): dependencies
	$(RJS) $(BUILD_CONFIG) optimize=none out=$(TARGET)

dependencies:
	npm install
	node_modules/.bin/bower install

surf: build
	chromium `pwd`/index.html
