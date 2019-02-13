install:
	npm install
	
gendiff:
	npx babel-node -- src/bin/gendiff.js $(arg1) $(arg2)

publish:
	npm publish

lint:
	npx eslint .
