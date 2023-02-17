import { createServer } from './server';
import prisma from './utils/prisma';
import { config } from './utils/config';
import cors from '@fastify/cors';
import corsOptions from './utils/corsOptions';

const server = createServer();

async function main() {
	try {
		server.register(cors, {
			origin: corsOptions,
			optionsSuccessStatus: 200,
			credentials: true,
		});

		await server.listen({
			port: config.PORT,
			host: config.HOST,
		});

		server.swagger();

		console.log(`Connected to the server on port: ${config.PORT}`);
	} catch (e) {
		console.log(e);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
