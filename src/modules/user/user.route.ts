import { FastifyInstance } from 'fastify';
import {
	createUserHandler,
	getNewAccessTokenHandler,
	loginHandler,
	logoutHandler,
} from './user.controller';
import { $ref } from './user.schema';

async function userRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				body: $ref('createUserSchema'),
				response: {
					201: $ref('userResponseSchema'),
				},
			},
		},
		createUserHandler
	);

	server.post(
		'/login',
		{
			schema: {
				body: $ref('loginSchema'),
				response: {
					200: $ref('loginResponseSchema'),
				},
			},
		},
		loginHandler
	);

	server.post('/logout', logoutHandler);

	server.get(
		'/refresh',
		{
			schema: {
				response: {
					200: $ref('loginResponseSchema'),
				},
			},
		},
		getNewAccessTokenHandler
	);
}

export default userRoutes;
