import { createServer } from './utils/createServer';
import prisma from './utils/prisma';
import { config } from './utils/config';

export const server = createServer();

async function main() {
	try {
		await server.listen({
			port: config.PORT,
			host: config.HOST,
		});

		console.log('Connected to the server');
	} catch (e) {
		console.log(e);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
