import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServer } from '@apollo/server'
import kindeNode from '@kinde-oss/kinde-node'
import bodyParser from 'body-parser'
import express from 'express'
import http from 'http'
import cors from 'cors'

import { celebrityMutation, celebrityQuery } from './src/resolvers/celebrity.js'
import { businessMutation, businessQuery } from './src/resolvers/business.js'
import { reviewMutation, reviewQuery } from './src/resolvers/review.js'
import { stripeQuery, stripeMutation } from './src/resolvers/stripe.js'
import { userMutation, userQuery } from './src/resolvers/user.js'
import { workMutation, workQuery } from './src/resolvers/work.js'
import { fanQuery, fanMutation } from './src/resolvers/fan.js'
import { resolverMap } from './src/resolvers/date.js'
import { typeDefs } from './src/types.js'

(async function () {
    const app = express()
    const httpServer = http.createServer(app)

    const authenticate = await kindeNode(process.env.KINDE_DOMAIN)

    const resolvers = {
        Date: resolverMap,

        Query: {
            ...userQuery,
            ...celebrityQuery,
            ...fanQuery,
            ...businessQuery,
            ...reviewQuery,
            ...workQuery,
            ...stripeQuery
        },

        Mutation: {
            ...userMutation,
            ...celebrityMutation,
            ...fanMutation,
            ...businessMutation,
            ...reviewMutation,
            ...workMutation,
            ...stripeMutation
        }
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    })

    await server.start();

    app.use('/',
        cors<cors.CorsRequest>(),

        bodyParser.json({ limit: '50mb' }),

        expressMiddleware(server, {
            /*context: async (req) => {
                try {
                    const user = await authenticate(req);
                    return {
                        user
                    };
                } catch (error) {
                    console.error(error);
                    throw error
                }
            }*/
        }),
    );

    await new Promise<void>((resolve) => httpServer.listen({ port: Number.parseInt(process.env.PORT) || 3001 }, resolve));
    console.log(`🚀 Server ready at port ${Number.parseInt(process.env.PORT) || 3001}!`)
})()