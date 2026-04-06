import { fastifyCors } from '@fastify/cors';
import { fastifyJwt } from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { type FastifyError, fastify } from 'fastify';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { captureException, initSentry } from './lib/sentry.js';
import { routes } from './router.js';

initSentry();

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyMultipart);

app.register(fastifyCors, {
	origin: true,
	methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
});

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in .env');
}

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET,
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Social service API',
			description: 'API to make posts, comments, likes',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
	routePrefix: '/docs',
});

app.register(routes);

app.setErrorHandler((error: FastifyError, _request, reply) => {
	captureException(error);
	reply.status(error.statusCode ?? 500).send({ error: error.message });
});

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('HTTP server running on http://localhost:3333!');
	console.log('Docs available at http://localhost:3333/docs');
});
