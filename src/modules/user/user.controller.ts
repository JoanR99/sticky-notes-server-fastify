import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserInput } from './user.schema';
import { createUser } from './user.service';

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
