import { fastify } from "fastify"
import { fastifyCors } from "@fastify/cors"
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { subscribeToEventRoute } from "./routes/subscribe-to-event-route"
import { env } from "./env"
import { accessInviteLinkRoute } from "./routes/access-invite-link"

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(fastifyCors, {
    origin: "*",
    // origin: "https://devstage-xi.vercel.app/",
})
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "API DevStage - NLW Connect",
            description: "API for Fastify",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
})

app.register(subscribeToEventRoute)
app.register(accessInviteLinkRoute)

app.listen({ port: env.PORT }).then(() => {
    console.log("HTTP Server Running!")
    console.log(`DOCS -> http://localhost:${env.PORT}/docs`)
    console.log(`POSTGRESQL -> ${env.POSTGRES_URL}`)
    console.log(`REDIS -> ${env.REDIS_URL}`)
})
