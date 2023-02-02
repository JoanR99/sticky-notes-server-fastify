import { FastifyInstance } from 'fastify';
import { createNoteHandler, getNotesHandler } from './note.controller';
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
}

export default noteRoutes;
