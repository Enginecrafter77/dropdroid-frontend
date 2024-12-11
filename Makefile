.PHONY: default dev build pack zip clean mrproper

ZIP_NAME := dropdroid-src.zip
PACK_NAME := dropdroid-bin.zip
VUE_SOURCES := $(wildcard src/* src/**/*)
PUBLIC_DIR := $(wildcard public/**)
AUX_FILES := index.html .env.local env.d.ts vite.config.ts package.json package-lock.json eslint.config.js tsconfig.json tsconfig.node.json tsconfig.app.json

default: build

pack: ${PACK_NAME}
zip: ${ZIP_NAME}

node_modules: package.json package-lock.json
	npm install

dev: node_modules
	npm run dev

build: dist
dist: node_modules ${VUE_SOURCES} ${PUBLIC_DIR} ${AUX_FILES}
	npm run build

${PACK_NAME}: dist
	cd dist && zip -r ../${PACK_NAME} *

${ZIP_NAME}: Makefile ${VUE_SOURCES} ${PUBLIC_DIR} ${AUX_FILES}
	zip -r ${ZIP_NAME} $^

clean:
	rm -rf dist
	rm -f ${ZIP_NAME}

mrproper: clean
	rm -rf node_modules
