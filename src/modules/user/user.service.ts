import { hashPassword } from '../../utils/hash';
import prisma from '../../utils/prisma';
import { CreateUserInput } from './user.schema';

export async function createUser(userInput: CreateUserInput) {
	const { password } = userInput;
	const hash = await hashPassword(password);

	const user = await prisma.user.create({
		data: {
			...userInput,
			password: hash,
		},
	});

	return user;
}
