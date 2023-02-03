import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateNoteInput, GetNotesQuery, UpdateNoteInput } from './note.schema';
import {
	createNote,
	getNotes,
	updateNote,
	findBydId,
	deleteNote,
} from './note.service';

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

export async function updateNoteHandler(
	request: FastifyRequest<{ Body: UpdateNoteInput; Params: { id: number } }>,
	reply: FastifyReply
) {
	const { userId } = request.user;
	const { id } = request.params;
	const updateBody = request.body;

	const note = await findBydId(Number(id));

	if (!note) return reply.code(400).send({ errorMessage: 'note not found' });
	if (note.authorId !== userId) return reply.code(401).send();

	const updatedNote = await updateNote(note.id, updateBody);

	reply.code(200).send(updatedNote);
}

export async function deleteNoteHandler(
	request: FastifyRequest<{ Params: { id: number } }>,
	reply: FastifyReply
) {
	const { userId } = request.user;
	const { id } = request.params;

	const note = await findBydId(Number(id));

	if (!note) return reply.code(400).send({ errorMessage: 'note not found' });
	if (note.authorId !== userId) return reply.code(401).send();

	const deletedNote = await deleteNote(note.id);

	reply.code(200).send(deletedNote);
}
