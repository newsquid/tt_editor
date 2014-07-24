TARGET=tt_editor.js
RJS=./node_modules/.bin/r.js -o
BOWER=./node_modules/.bin/bower
BUILD_CONFIG=build.js

CSSS=$(wildcard src/css/*)

.PHONY: dependencies build surf serve

all: surf

build: $(TARGET) style.css

$(TARGET): dependencies
	$(RJS) $(BUILD_CONFIG) out=$(TARGET)

style.css: $(CSSS)
	cat src/css/* > style.css

surf: build
	chromium http://localhost:8000/fake.html
	chromium http://localhost:8000
	$(MAKE) serve

serve:
	python3 -m http.server

dependencies:
	npm install
	$(BOWER) install
	$(BOWER) update
