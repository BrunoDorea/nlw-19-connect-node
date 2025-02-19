import { env } from "./env"
import { fastify } from "fastify"
import { fastifyCors } from "@fastify/cors"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import { subscribeToEventRoute } from "./routes/subscribe-to-event-route"
import { accessInviteLinkRoute } from "./routes/access-invite-link-route"
import { getSubscriberInviteClicksRoute } from "./routes/get-subscriber-invite-clicks-route"
import { getSubscriberInvitesCountRoute } from "./routes/get-subscriber-invites-count-route"
import { getSubscriberRankingPositionRoute } from "./routes/get-subscriber-ranking-position-route"
import { getRankingRoute } from "./routes/get-ranking-route"

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
app.register(getSubscriberInviteClicksRoute)
app.register(getSubscriberInvitesCountRoute)
app.register(getSubscriberRankingPositionRoute)
app.register(getRankingRoute)

const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${env.PORT}`
app.listen({ port: env.PORT }).then(() => {
    console.log("HTTP Server Running!")
    console.log(`DOCS -> ${baseUrl}/docs`)
    console.log(`POSTGRESQL -> ${env.POSTGRES_URL}`)
    console.log(`REDIS -> ${env.REDIS_URL}`)
})
