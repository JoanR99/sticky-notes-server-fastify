import Fastify from 'fastify';
import noteRoutes from './modules/note/note.route';
import userRoutes from './modules/user/user.route';
import prisma from './utils/prisma';
import { userSchemas } from './modules/user/user.schema';

const server = Fastify({ logger: true });

server.get('/health', async () => {
	return { status: 'ok' };
});

async function main() {
	for (const schema of userSchemas) {
		server.addSchema(schema);
	}

	server.register(noteRoutes, { prefix: '/api/notes' });
	server.register(userRoutes, { prefix: '/api/users' });
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
