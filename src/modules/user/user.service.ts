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

export async function findById(id: number) {
	const user = await prisma.user.findUnique({ where: { id } });

	return user;
}

export async function findByEmail(email: string) {
	const user = await prisma.user.findUnique({ where: { email } });

	return user;
}

export async function findByRefreshToken(refreshToken: string) {
	const user = await prisma.user.findFirst({ where: { refreshToken } });

	return user;
}

export async function updateRefreshToken(userId: number, refreshToken: string) {
	await prisma.user.update({
		where: { id: userId },
		data: {
			refreshToken,
		},
	});
}
