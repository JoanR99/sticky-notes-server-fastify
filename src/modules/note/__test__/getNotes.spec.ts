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

describe('GET /api/notes route', () => {
	describe('Success cases', () => {
		it('should call the getNotes service', async () => {
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

			const getNotesSpy = vi.spyOn(noteService, 'getNotes');

			getNotesSpy.mockResolvedValue([note]);

			await server.inject({
				method: 'GET',
				url: '/api/notes',
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(getNotesSpy).toHaveBeenCalledWith(user.id, {});
		});

		it.each([
			{ queryField: 'isArchive', value: 'false' },
			{ queryField: 'color', value: 'red' },
			{ queryField: 'search', value: 'title' },
		])(
			'should call the getNotes service with $queryField in query argument',
			async ({ queryField, value }) => {
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

				const getNotesSpy = vi.spyOn(noteService, 'getNotes');

				getNotesSpy.mockResolvedValue([note]);

				await server.inject({
					method: 'GET',
					url: '/api/notes',
					query: { [queryField]: value },
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				});

				expect(getNotesSpy).toHaveBeenCalledWith(user.id, {
					[queryField]: value,
				});
			}
		);

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

			const getNotesSpy = vi.spyOn(noteService, 'getNotes');

			getNotesSpy.mockResolvedValue([note]);

			const getNotesResponse = await server.inject({
				method: 'GET',
				url: '/api/notes',
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			expect(getNotesResponse.statusCode).toBe(200);
		});

		it('should return notes array on success', async () => {
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

			const getNotesSpy = vi.spyOn(noteService, 'getNotes');

			getNotesSpy.mockResolvedValue([note]);

			const getNotesResponse = await server.inject({
				method: 'GET',
				url: '/api/notes',
				payload: createNotePayload,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});
			expect(getNotesResponse.json().length).toBe(1);
			expect(Object.keys(getNotesResponse.json()[0])).toEqual([
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
		it('should return code 401 when request is sent without accessToken', async () => {
			const server = createServer();

			await server.ready();

			const getNoteResponse = await server.inject({
				method: 'GET',
				url: '/api/notes',
			});

			expect(getNoteResponse.statusCode).toBe(401);
		});
	});
});
