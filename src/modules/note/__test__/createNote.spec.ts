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

describe('POST /api/notes route', () => {
	describe('Success cases', () => {
		it('should call the createNote service', async () => {
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

			const createNoteSpy = vi.spyOn(noteService, 'createNote');

			createNoteSpy.mockResolvedValue(note);

			await server.inject({
				method: 'POST',
				url: '/api/notes',
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(createNoteSpy).toHaveBeenCalledWith(createNotePayload, user.id);
		});

		it('should return status 201 with correct input', async () => {
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

			const createNoteSpy = vi.spyOn(noteService, 'createNote');

			createNoteSpy.mockResolvedValue(note);

			const createNoteResponse = await server.inject({
				method: 'POST',
				url: '/api/notes',
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(createNoteResponse.statusCode).toBe(201);
		});

		it('should return note info on success', async () => {
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

			const createNoteSpy = vi.spyOn(noteService, 'createNote');

			createNoteSpy.mockResolvedValue(note);

			const createNoteResponse = await server.inject({
				method: 'POST',
				url: '/api/notes',
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(Object.keys(createNoteResponse.json())).toEqual([
				'id',
				'title',
				'content',
				'isArchive',
				'authorId',
				'color',
				'createdAt',
				'updatedAt',
			]);
		});
	});

	describe('Fail cases', () => {
		it.each([
			{ fieldName: 'title' },
			{ fieldName: 'content' },
			{ fieldName: 'color' },
		])(
			'should return error when $fieldName input field is missing',
			async ({ fieldName }) => {
				const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
				const updateRefreshTokenSpy = vi.spyOn(
					userService,
					'updateRefreshToken'
				);

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

				const createNoteSpy = vi.spyOn(noteService, 'createNote');

				createNoteSpy.mockResolvedValue(note);

				const failPayload = { ...createNotePayload, [fieldName]: undefined };

				const createNoteResponse = await server.inject({
					method: 'POST',
					url: '/api/notes',
					payload: failPayload,
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				});

				expect(createNoteResponse.statusCode).toBe(400);
				expect(createNoteResponse.json()).toEqual({
					error: 'Bad Request',
					message: `body must have required property '${fieldName}'`,
					statusCode: 400,
				});
			}
		);

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

			const createNoteSpy = vi.spyOn(noteService, 'createNote');

			createNoteSpy.mockResolvedValue(note);

			const failPayload = { ...createNotePayload, color: 'black' };

			const createNoteResponse = await server.inject({
				method: 'POST',
				url: '/api/notes',
				payload: failPayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(createNoteResponse.statusCode).toBe(400);
			expect(createNoteResponse.json()).toEqual({
				error: 'Bad Request',
				message: `body/color must be equal to one of the allowed values`,
				statusCode: 400,
			});
		});

		it('should return code 401 when request is sent without accessToken', async () => {
			const server = createServer();

			await server.ready();

			const createNoteResponse = await server.inject({
				method: 'POST',
				url: '/api/notes',
				payload: createNotePayload,
			});

			expect(createNoteResponse.statusCode).toBe(401);
		});
	});
});
