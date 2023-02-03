import { describe, it, vi, expect } from 'vitest';
import { createServer } from '../../../server';
import { hashPassword } from '../../../utils/hash';
import * as userService from '../../user/user.service';
import * as noteService from '../note.service';

const user = {
	id: 1,
	username: 'user1',
	email: 'user1@email.com',
	password: 'hashed-p4sword',
	refreshToken: 'refresh-token',
	createdAt: new Date(),
	updatedAt: new Date(),
	notes: [],
};

const payload = {
	username: 'user1',
	email: 'user1@email.com',
	password: '#P4ssword',
};

const note = {
	id: 1,
	title: 'title',
	content: 'content',
	color: 'red',
	authorId: 1,
	isArchive: false,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const createNotePayload = {
	title: 'title',
	content: 'content',
	color: 'red',
};

describe('PATCH /api/notes/:id route', () => {
	describe('Success cases', () => {
		it('should call the findById and updateNote services', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
			const updateRefreshTokenSpy = vi.spyOn(userService, 'updateRefreshToken');

			const userMock = {
				...user,
				password: await hashPassword('#P4ssword'),
			};

			findByEmailSpy.mockResolvedValue(userMock);
			updateRefreshTokenSpy.mockImplementation(
				async (userId, resfreshToken) => {}
			);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			const { accessToken } = await response.json();

			const findByIdSpy = vi.spyOn(noteService, 'findBydId');
			const updateNoteSpy = vi.spyOn(noteService, 'updateNote');

			findByIdSpy.mockResolvedValue(note);
			updateNoteSpy.mockResolvedValue(note);

			await server.inject({
				method: 'PATCH',
				url: `/api/notes/1`,
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(findByIdSpy).toHaveBeenCalledWith(user.id);
			expect(updateNoteSpy).toHaveBeenCalledWith(1, createNotePayload);
		});

		it('should return status 200 on success', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
			const updateRefreshTokenSpy = vi.spyOn(userService, 'updateRefreshToken');

			const userMock = {
				...user,
				password: await hashPassword('#P4ssword'),
			};

			findByEmailSpy.mockResolvedValue(userMock);
			updateRefreshTokenSpy.mockImplementation(
				async (userId, resfreshToken) => {}
			);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			const { accessToken } = await response.json();

			const findByIdSpy = vi.spyOn(noteService, 'findBydId');
			const updateNoteSpy = vi.spyOn(noteService, 'updateNote');

			findByIdSpy.mockResolvedValue(note);
			updateNoteSpy.mockResolvedValue(note);

			const updateNoteResponse = await server.inject({
				method: 'PATCH',
				url: `/api/notes/1`,
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(updateNoteResponse.statusCode).toBe(200);
		});

		it('should return updated note on success', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
			const updateRefreshTokenSpy = vi.spyOn(userService, 'updateRefreshToken');

			const userMock = {
				...user,
				password: await hashPassword('#P4ssword'),
			};

			findByEmailSpy.mockResolvedValue(userMock);
			updateRefreshTokenSpy.mockImplementation(
				async (userId, resfreshToken) => {}
			);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			const { accessToken } = await response.json();

			const findByIdSpy = vi.spyOn(noteService, 'findBydId');
			const updateNoteSpy = vi.spyOn(noteService, 'updateNote');

			const updatePayload = {
				title: 'new title',
				color: 'pink',
			};

			const updatedNote = {
				...note,
				title: updatePayload.title,
				color: updatePayload.color,
			};

			findByIdSpy.mockResolvedValue(note);
			updateNoteSpy.mockResolvedValue(updatedNote);

			const updateNoteResponse = await server.inject({
				method: 'PATCH',
				url: `/api/notes/1`,
				payload: updatePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});
			expect(Object.keys(updateNoteResponse.json())).toEqual([
				'id',
				'title',
				'content',
				'color',
				'authorId',
				'isArchive',
				'createdAt',
				'updatedAt',
			]);

			expect(updateNoteResponse.json()).toEqual({
				...updatedNote,
				createdAt: updatedNote.createdAt.toISOString(),
				updatedAt: updatedNote.updatedAt.toISOString(),
			});
		});
	});

	describe('Fail cases', () => {
		it('should return error when note id not found', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
			const updateRefreshTokenSpy = vi.spyOn(userService, 'updateRefreshToken');

			const userMock = {
				...user,
				password: await hashPassword('#P4ssword'),
			};

			findByEmailSpy.mockResolvedValue(userMock);
			updateRefreshTokenSpy.mockImplementation(
				async (userId, resfreshToken) => {}
			);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			const { accessToken } = await response.json();

			const findByIdSpy = vi.spyOn(noteService, 'findBydId');
			const updateNoteSpy = vi.spyOn(noteService, 'updateNote');

			findByIdSpy.mockResolvedValue(null);
			updateNoteSpy.mockResolvedValue(note);

			const updateNoteResponse = await server.inject({
				method: 'PATCH',
				url: `/api/notes/1`,
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(updateNoteResponse.statusCode).toBe(400);
			expect(updateNoteResponse.json()).toEqual({
				errorMessage: 'note not found',
			});
		});

		it('should return error when userId and note authorId does not match', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
			const updateRefreshTokenSpy = vi.spyOn(userService, 'updateRefreshToken');

			const userMock = {
				...user,
				password: await hashPassword('#P4ssword'),
			};

			findByEmailSpy.mockResolvedValue(userMock);
			updateRefreshTokenSpy.mockImplementation(
				async (userId, resfreshToken) => {}
			);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			const { accessToken } = await response.json();

			const findByIdSpy = vi.spyOn(noteService, 'findBydId');
			const updateNoteSpy = vi.spyOn(noteService, 'updateNote');

			findByIdSpy.mockResolvedValue({ ...note, authorId: 10 });
			updateNoteSpy.mockResolvedValue(note);

			const updateNoteResponse = await server.inject({
				method: 'PATCH',
				url: `/api/notes/1`,
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(updateNoteResponse.statusCode).toBe(401);
		});

		it('should return error when color is invalid', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
			const updateRefreshTokenSpy = vi.spyOn(userService, 'updateRefreshToken');

			const userMock = {
				...user,
				password: await hashPassword('#P4ssword'),
			};

			findByEmailSpy.mockResolvedValue(userMock);
			updateRefreshTokenSpy.mockImplementation(
				async (userId, resfreshToken) => {}
			);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			const { accessToken } = await response.json();

			const failPayload = { color: 'black' };

			const updateNoteResponse = await server.inject({
				method: 'PATCH',
				url: `/api/notes/1`,
				payload: failPayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(updateNoteResponse.statusCode).toBe(400);
			expect(updateNoteResponse.json()).toEqual({
				error: 'Bad Request',
				message: `body/color must be equal to one of the allowed values`,
				statusCode: 400,
			});
		});

		it('should return code 401 when request is sent without accessToken', async () => {
			const server = createServer();

			await server.ready();

			const updateNoteResponse = await server.inject({
				method: 'POST',
				url: '/api/notes',
				payload: createNotePayload,
			});

			expect(updateNoteResponse.statusCode).toBe(401);
		});
	});
});
