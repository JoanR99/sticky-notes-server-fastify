import { z } from 'zod';

export const noteSchema = z.object({
	id: z.number(),
	title: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	}),
	content: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	}),
	isArchive: z.boolean().default(false),
	autorId: z.number(),
	color: z.enum(['red', 'yellow']),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const createNoteSchema = noteSchema.pick({
	title: true,
	content: true,
	colorId: true,
});

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
