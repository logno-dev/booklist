run:
	node ./server/index.js &
	sudo caddy file-server ./dist/
