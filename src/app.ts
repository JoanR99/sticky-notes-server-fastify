import Fastify from 'fastify';
import noteRoutes from './modules/note/note.route';
import userRoutes from './modules/user/user.route';

const server = Fastify({ logger: true });

server.register(noteRoutes, { prefix: '/api/notes' });
server.register(userRoutes, { prefix: '/api/users' });

server.get('/health', async () => {
	return { status: 'ok' };
});

async function main() {
	try {
		await server.listen({
			port: 3000,
			host: '0.0.0.0',
		});

		console.log('Connected to the server');
	} catch (e) {
		server.log.error(e);
		process.exit(1);
	}
}

main();
