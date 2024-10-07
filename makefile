run:
	node ./server/index.js
	caddy file-server ./dist/
