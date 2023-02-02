import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import noteRoutes from './modules/note/note.route';
import userRoutes from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';
import { config } from './utils/config';
import jwt, { JWT } from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { noteSchemas } from './modules/note/note.schema';
import cors from '@fastify/cors';
import corsOptions from './utils/corsOptions';

declare module 'fastify' {
	export interface FastifyRequest {
		jwt: JWT;
	}
	export interface FastifyInstance {
		auth: any;
	}
}

declare module '@fastify/jwt' {
	export interface FastifyJWT {
		user: {
			userId: number;
		};
	}
}

const myCustomMessages = {
	badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
	noAuthorizationInHeaderMessage: 'Autorization header is missing!',
	authorizationTokenExpiredMessage: 'Authorization token expired',
	authorizationTokenInvalid: (err: { message: string }) => {
		return `Authorization token is invalid: ${err.message}`;
	},
};

export function createServer() {
	const server = Fastify();

	server.register(cors, {
		origin: corsOptions,
		optionsSuccessStatus: 200,
		credentials: true,
	});

	server.register(jwt, {
		secret: config.JWT_SECRET,
		cookie: {
			cookieName: 'refreshToken',
			signed: true,
		},
		sign: {
			expiresIn: '10m',
		},
		messages: myCustomMessages,
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

	for (const schema of [...userSchemas, ...noteSchemas]) {
		server.addSchema(schema);
	}

	server.register(noteRoutes, { prefix: '/api/notes' });
	server.register(userRoutes, { prefix: '/api/users' });

	return server;
}
