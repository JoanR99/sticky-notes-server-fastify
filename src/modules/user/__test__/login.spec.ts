import { describe, it, vi, expect } from 'vitest';
import { createServer } from '../../../utils/createServer';
import { hashPassword } from '../../../utils/hash';
import * as userService from '../user.service';

const user = {
	id: 1,
	username: 'user1',
	email: 'user1@email.com',
	password: '#P4ssword',
	refreshToken: 'refresh-token',
	createdAt: new Date(),
	updatedAt: new Date(),
	notes: [],
};

const payload = {
	email: 'user1@email.com',
	password: '#P4ssword',
};

describe('POST /api/users/login', () => {
	describe('Success cases', () => {
		it('should call the findByEmail and updateRefreshToken services', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');
			const updateRefreshTokenSpy = vi.spyOn(userService, 'updateRefreshToken');

			expect(findByEmailSpy.getMockName()).toEqual('findByEmail');
			expect(updateRefreshTokenSpy.getMockName()).toEqual('updateRefreshToken');

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

			await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			expect(findByEmailSpy).toHaveBeenCalledWith(payload.email);
			expect(updateRefreshTokenSpy).toHaveBeenCalled();
		});

		it('should return status 200 on valid request', async () => {
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

			expect(response.statusCode).toBe(200);
		});

		it('should return accessToken on valid request', async () => {
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

			expect(Object.keys(response.json())).toEqual(['accessToken']);
		});

		it('should set refreshToken in cookie', async () => {
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

			expect(response.headers).toHaveProperty('set-cookie');
		});
	});

	describe('Fail cases', () => {
		it.each([{ fieldName: 'email' }, { fieldName: 'password' }])(
			'should return error when $fieldName input field is missing',
			async ({ fieldName }) => {
				const newPayload = { ...payload, [fieldName]: undefined };

				const server = createServer();

				await server.ready();

				const response = await server.inject({
					method: 'POST',
					url: '/api/users/login',
					payload: newPayload,
				});

				expect(response.statusCode).toBe(400);
				expect(response.json()).toEqual({
					error: 'Bad Request',
					message: `body must have required property '${fieldName}'`,
					statusCode: 400,
				});
			}
		);

		it('should return error when email is malformed', async () => {
			const newPayload = { ...payload, email: 'bad-email' };

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload: newPayload,
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toEqual({
				error: 'Bad Request',
				message: `body/email must match format "email"`,
				statusCode: 400,
			});
		});

		it('should return code 403 when email is unknown', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');

			findByEmailSpy.mockResolvedValue(null);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			expect(response.statusCode).toBe(403);
		});

		it('should return code 403 when passwords do not match', async () => {
			const findByEmailSpy = vi.spyOn(userService, 'findByEmail');

			const userMock = {
				...user,
				password: 'password-do-not-match',
			};

			findByEmailSpy.mockResolvedValue(userMock);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users/login',
				payload,
			});

			expect(response.statusCode).toBe(403);
		});
	});
});
