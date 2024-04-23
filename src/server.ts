import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/registe-for-event";
import { getEvent } from "./routes/get-event";
import { getAttenddeBadge } from "./routes/get-attendde-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttenddes } from "./routes/get-event-attenddes";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { errorHandler } from "./error/error-handler";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*'
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Pass.In',
      description: 'Especificações da API para o back-end da aplicação pass.in.',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttenddeBadge)
app.register(checkIn)
app.register(getEventAttenddes)

app.setErrorHandler(errorHandler)

app.listen({port:3333, host: '0.0.0.0'}).then(() => console.log('🔥 Server Running 🔥'))