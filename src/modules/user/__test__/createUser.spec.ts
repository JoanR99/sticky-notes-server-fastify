import { describe, it, vi, expect } from 'vitest';
import { createServer } from '../../../utils/createServer';
import * as userService from '../user.service';

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

describe('POST /api/users route', () => {
	describe('Success cases', () => {
		it('should call the createUser service', async () => {
			const createUserSpy = vi.spyOn(userService, 'createUser');

			expect(createUserSpy.getMockName()).toEqual('createUser');

			createUserSpy.mockResolvedValue(user);

			const server = createServer();

			await server.ready();

			await server.inject({
				method: 'POST',
				url: '/api/users',
				payload,
			});

			expect(createUserSpy).toHaveBeenCalledWith(payload);
		});

		it('should return status 201 with correct input', async () => {
			const createUserSpy = vi.spyOn(userService, 'createUser');

			expect(createUserSpy.getMockName()).toEqual('createUser');

			createUserSpy.mockResolvedValue(user);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users',
				payload,
			});

			expect(response.statusCode).toBe(201);
		});

		it('should not return password and refreshToken on success', async () => {
			const createUserSpy = vi.spyOn(userService, 'createUser');

			expect(createUserSpy.getMockName()).toEqual('createUser');

			createUserSpy.mockResolvedValue(user);

			const server = createServer();

			await server.ready();

			const response = await server.inject({
				method: 'POST',
				url: '/api/users',
				payload,
			});

			expect(Object.keys(response.json())).toEqual([
				'id',
				'username',
				'email',
				'createdAt',
				'updatedAt',
			]);
		});
	});

	describe('Fail cases', () => {
		it.each([
			{ fieldName: 'username' },
			{ fieldName: 'email' },
			{ fieldName: 'password' },
		])(
			'should return error when $fieldName input field is missing',
			async ({ fieldName }) => {
				const server = createServer();

				await server.ready();

				const failPayload = { ...payload, [fieldName]: undefined };

				const response = await server.inject({
					method: 'POST',
					url: '/api/users',
					payload: failPayload,
				});

				expect(response.statusCode).toBe(400);
				expect(response.json()).toEqual({
					error: 'Bad Request',
					message: `body must have required property '${fieldName}'`,
					statusCode: 400,
				});
			}
		);

		it('should return error when email is invalid', async () => {
			const server = createServer();

			await server.ready();

			const failPayload = { ...payload, email: 'hello' };

			const response = await server.inject({
				method: 'POST',
				url: '/api/users',
				payload: failPayload,
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toEqual({
				error: 'Bad Request',
				message: `body/email must match format "email"`,
				statusCode: 400,
			});
		});

		it('should return error when username is too short', async () => {
			const server = createServer();

			await server.ready();

			const failPayload = { ...payload, username: 'h' };

			const response = await server.inject({
				method: 'POST',
				url: '/api/users',
				payload: failPayload,
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toEqual({
				error: 'Bad Request',
				message: `body/username must NOT have fewer than 2 characters`,
				statusCode: 400,
			});
		});

		it('should return error when username is too large', async () => {
			const server = createServer();

			await server.ready();

			const failPayload = {
				...payload,
				username: 'hellomynameisjoandeveloper',
			};

			const response = await server.inject({
				method: 'POST',
				url: '/api/users',
				payload: failPayload,
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toEqual({
				error: 'Bad Request',
				message: `body/username must NOT have more than 20 characters`,
				statusCode: 400,
			});
		});

		it('should return error when password is invalid', async () => {
			const server = createServer();

			await server.ready();

			const failPayload = {
				...payload,
				password: 'password',
			};

			const response = await server.inject({
				method: 'POST',
				url: '/api/users',
				payload: failPayload,
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toEqual({
				error: 'Bad Request',
				message: `body/password must match pattern "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])"`,
				statusCode: 400,
			});
		});
	});
});
