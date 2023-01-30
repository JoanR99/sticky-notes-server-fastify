import { createServer } from './utils/createServer';
import prisma from './utils/prisma';

const server = createServer();

async function main() {
	try {
		await server.listen({
			port: 3000,
			host: '0.0.0.0',
		});

		console.log('Connected to the server');
	} catch (e) {
		server.log.error(e);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
