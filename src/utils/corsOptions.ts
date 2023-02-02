import allowedOrigins from './allowedOrigins';

const corsOptions = (origin: any, callback: any) => {
	if (origin && allowedOrigins.indexOf(origin) !== -1) {
		callback(null, origin);
	} else {
		callback(new Error('Not allowed by CORS'));
	}
};

export default corsOptions;
