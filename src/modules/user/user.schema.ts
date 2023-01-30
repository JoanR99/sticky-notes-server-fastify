import { z } from 'zod';
import { noteSchema } from '../note/note.schema';

export const userSchema = z.object({
	id: z.number(),
	username: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	}),
	email: z
		.string({
			required_error: 'Name is required',
			invalid_type_error: 'Name must be a string',
		})
		.email(),
	password: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	}),
	refreshToken: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	}),
	createdAt: z.date(),
	updatedAt: z.date(),
	notes: z.array(noteSchema),
});

export const userResponseSchema = userSchema.pick({
	id: true,
	username: true,
	email: true,
	password: true,
	refreshToken: true,
	createdAt: true,
	updatedAt: true,
	notes: true,
});

const createUserSchema = userSchema.pick({
	username: true,
	email: true,
	password: true,
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
