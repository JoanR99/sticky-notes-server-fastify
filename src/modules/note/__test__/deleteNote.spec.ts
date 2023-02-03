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

describe('DELETE /api/notes/:id route', () => {
	describe('Success cases', () => {
		it('should call the findById and deleteNote services', async () => {
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
			const deleteNoteSpy = vi.spyOn(noteService, 'deleteNote');

			findByIdSpy.mockResolvedValue(note);
			deleteNoteSpy.mockResolvedValue(note);

			await server.inject({
				method: 'DELETE',
				url: `/api/notes/1`,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(findByIdSpy).toHaveBeenCalledWith(user.id);
			expect(deleteNoteSpy).toHaveBeenCalledWith(note.id);
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
			const deleteNoteSpy = vi.spyOn(noteService, 'deleteNote');

			findByIdSpy.mockResolvedValue(note);
			deleteNoteSpy.mockResolvedValue(note);

			const deleteNoteResponse = await server.inject({
				method: 'DELETE',
				url: `/api/notes/1`,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(deleteNoteResponse.statusCode).toBe(200);
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
			const deleteNoteSpy = vi.spyOn(noteService, 'deleteNote');

			findByIdSpy.mockResolvedValue(note);
			deleteNoteSpy.mockResolvedValue(note);

			const deleteNoteResponse = await server.inject({
				method: 'DELETE',
				url: `/api/notes/1`,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(Object.keys(deleteNoteResponse.json())).toEqual([
				'id',
				'title',
				'content',
				'color',
				'authorId',
				'isArchive',
				'createdAt',
				'updatedAt',
			]);
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
			const deleteNoteSpy = vi.spyOn(noteService, 'deleteNote');

			findByIdSpy.mockResolvedValue(null);
			deleteNoteSpy.mockResolvedValue(note);

			const deleteNoteResponse = await server.inject({
				method: 'DELETE',
				url: `/api/notes/1`,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(deleteNoteResponse.statusCode).toBe(400);
			expect(deleteNoteResponse.json()).toEqual({
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
			const deleteNoteSpy = vi.spyOn(noteService, 'deleteNote');

			findByIdSpy.mockResolvedValue({ ...note, authorId: 10 });
			deleteNoteSpy.mockResolvedValue(note);

			const deleteNoteResponse = await server.inject({
				method: 'DELETE',
				url: `/api/notes/1`,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(deleteNoteResponse.statusCode).toBe(401);
		});
		it('should return code 401 when request is sent without accessToken', async () => {
			const server = createServer();

			await server.ready();

			const deleteNoteResponse = await server.inject({
				method: 'DELETE',
				url: `/api/notes/1`,
			});

			expect(deleteNoteResponse.statusCode).toBe(401);
		});
	});
});
