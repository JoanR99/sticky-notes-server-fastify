import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyPasswordMatch } from '../../utils/hash';
import { CreateUserInput, UserLoginInput } from './user.schema';
import {
	createUser,
	findByEmail,
	findByRefreshToken,
	updateRefreshToken,
} from './user.service';

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

export async function createUserHandler(
	request: FastifyRequest<{ Body: CreateUserInput }>,
	reply: FastifyReply
) {
	const noteInput = request.body;

	try {
		const user = await createUser(noteInput);

		return reply.code(201).send(user);
	} catch (e) {
		console.log(e);
		reply.code(500).send(e);
	}
}

export async function loginHandler(
	request: FastifyRequest<{ Body: UserLoginInput }>,
	reply: FastifyReply
) {
	const { email, password } = request.body;

	const user = await findByEmail(email);

	if (user && (await verifyPasswordMatch(password, user.password))) {
		const accessToken = await reply.jwtSign(
			{
				userId: user.id,
			},
			{ expiresIn: '15m' }
		);
		const refreshToken = await reply.jwtSign(
			{
				userId: user.id,
			},
			{ expiresIn: '1d' }
		);

		await updateRefreshToken(user.id, refreshToken);

		return reply
			.setCookie('refreshToken', refreshToken, {
				secure: true,
				httpOnly: true,
				sameSite: 'none',
				maxAge: oneDayInMilliseconds,
			})
			.code(200)
			.send({ accessToken });
	}

	reply.code(403).send();
}

export async function logoutHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { refreshToken } = request.cookies;

	if (!refreshToken) return reply.code(403);

	const user = await findByRefreshToken(refreshToken);

	if (!user) {
		return reply
			.clearCookie('refreshToken', {
				secure: true,
				httpOnly: true,
				sameSite: 'none',
				maxAge: oneDayInMilliseconds,
			})
			.code(204)
			.send();
	}

	await updateRefreshToken(user.id, '');

	reply
		.clearCookie('refreshToken', {
			secure: true,
			httpOnly: true,
			sameSite: 'none',
			maxAge: oneDayInMilliseconds,
		})
		.code(204)
		.send();
}

export async function getNewAccessTokenHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const refreshToken = request.cookies?.refreshToken;

	if (!refreshToken) return reply.code(403).send();

	const decode = request.jwt.decode(refreshToken) as { userId: number };

	const user = await findByRefreshToken(refreshToken);

	if (!user || user.id !== decode.userId) return reply.code(403).send();

	const accessToken = await reply.jwtSign({
		userId: user.id,
	});

	reply.code(200).send({ accessToken });
}
