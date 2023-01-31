import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import noteRoutes from './modules/note/note.route';
import userRoutes from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';
import { config } from './utils/config';
import jwt, { JWT } from '@fastify/jwt';
import cookie from '@fastify/cookie';

declare module 'fastify' {
	export interface FastifyRequest {
		jwt: JWT;
	}
	export interface FastifyInstance {
		auth: any;
	}
}

export function createServer() {
	const server = Fastify();

	server.register(jwt, {
		secret: config.JWT_SECRET,
		cookie: {
			cookieName: 'refreshToken',
			signed: true,
		},
		sign: {
			expiresIn: '10m',
		},
	});

	server.register(cookie);

	server.addHook('onRequest', (request, reply, done) => {
		request.jwt = server.jwt;
		done();
	});

	server.decorate(
		'auth',
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (e) {
				reply.send(e);
			}
		}
	);

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
