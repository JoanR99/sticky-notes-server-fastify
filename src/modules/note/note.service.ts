import prisma from '../../utils/prisma';
import { CreateNoteInput, GetNotesQuery, UpdateNoteInput } from './note.schema';

export async function createNote(noteBody: CreateNoteInput, userId: number) {
	const note = await prisma.note.create({
		data: {
			...noteBody,
			authorId: userId,
		},
	});

	return note;
}

export async function getNotes(userId: number, query: GetNotesQuery) {
	const { isArchive, color, search } = query;
	const booleanIsArchive = isArchive === 'true';

	const notes = await prisma.note.findMany({
		where: {
			authorId: userId,
			isArchive: booleanIsArchive,
			color,
			AND: [
				{
					OR: [
						{
							title: {
								contains: search,
								mode: 'insensitive',
							},
						},
						{
							content: {
								contains: search,
								mode: 'insensitive',
							},
						},
					],
				},
			],
		},
	});

	return notes;
}

export async function updateNote(noteId: number, noteBody: UpdateNoteInput) {
	const note = await prisma.note.update({
		where: {
			id: noteId,
		},
		data: {
			...noteBody,
		},
	});

	return note;
}

export async function deleteNote(noteId: number) {
	const note = await prisma.note.delete({
		where: {
			id: noteId,
		},
	});

	return note;
}

export async function findBydId(noteId: number) {
	const note = await prisma.note.findUnique({
		where: {
			id: noteId,
		},
	});

	return note;
}
