import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateNoteInput, GetNotesQuery } from './note.schema';
import { createNote, getNotes } from './note.service';

export async function createNoteHandler(
	request: FastifyRequest<{ Body: CreateNoteInput }>,
	reply: FastifyReply
) {
	const noteBody = request.body;

	const { userId } = request.user;

	const note = await createNote(noteBody, userId);

	reply.code(201).send(note);
}

export async function getNotesHandler(
	request: FastifyRequest<{ Querystring: GetNotesQuery }>,
	reply: FastifyReply
) {
	const { userId } = request.user;

	const notes = await getNotes(userId, request.query);

	reply.code(200).send(notes);
}
