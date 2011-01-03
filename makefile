# Simple makefile
# Requires 'yuicompressor' script for minifying vid.js

.PHONY: all clean

all: vid.min.js

clean:
	-rm vid.min.js

vid.min.js: vid.js
	yuicompressor $^ > $@ 
