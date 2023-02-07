import { FastifyInstance } from 'fastify';
import {
	createNoteHandler,
	getNotesHandler,
	updateNoteHandler,
	deleteNoteHandler,
} from './note.controller';
import { $ref } from './note.schema';

async function noteRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			preHandler: [server.auth],
			schema: {
				body: $ref('createNoteSchema'),
				response: {
					201: $ref('noteSchema'),
				},
			},
		},
		createNoteHandler
	);

	server.get(
		'/',
		{
			preHandler: [server.auth],
			schema: {
				querystring: $ref('getNotesQuerySchema'),
				response: {
					200: $ref('getNotesResponseSchema'),
				},
			},
		},
		getNotesHandler
	);

	server.patch(
		'/:id',
		{
			preHandler: [server.auth],
			schema: {
				params: $ref('requestParams'),
				body: $ref('updateNoteSchema'),
				response: {
					200: $ref('noteSchema'),
				},
			},
		},
		updateNoteHandler
	);

	server.delete(
		'/:id',
		{
			preHandler: [server.auth],
			schema: {
				params: $ref('requestParams'),
				response: {
					200: $ref('noteSchema'),
				},
			},
		},
		deleteNoteHandler
	);
}

export default noteRoutes;
