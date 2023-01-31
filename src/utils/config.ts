import envSchema from 'env-schema';
import { Type, Static } from '@sinclair/typebox';

const schema = Type.Object({
	DATABASE_URL: Type.String(),
	PORT: Type.Number({ default: 3000 }),
	HOST: Type.String({ default: '0.0.0.0' }),
	JWT_SECRET: Type.String(),
});

type Env = Static<typeof schema>;

export const config = envSchema<Env>({
	schema,
	dotenv: true,
});
