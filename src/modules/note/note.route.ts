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
		},
		getNotesHandler
	);

	server.patch(
		'/:id',
		{
			preHandler: [server.auth],
			schema: {
				body: $ref('updateNoteSchema'),
			},
		},
		updateNoteHandler
	);

	server.delete(
		'/:id',
		{
			preHandler: [server.auth],
		},
		deleteNoteHandler
	);
}

export default noteRoutes;
