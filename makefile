start:
	pm2 delete 0
	pm2 start server/index.js
	pnpm build
	sudo pnpm preview
