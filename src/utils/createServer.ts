import Fastify from 'fastify';
import noteRoutes from '../modules/note/note.route';
import userRoutes from '../modules/user/user.route';
import { userSchemas } from '../modules/user/user.schema';

export function createServer() {
	const server = Fastify({ logger: true });

	server.get('/health', async () => {
		return { status: 'ok' };
	});

	for (const schema of userSchemas) {
		server.addSchema(schema);
	}

	server.register(noteRoutes, { prefix: '/api/notes' });
	server.register(userRoutes, { prefix: '/api/users' });

	return server;
}
