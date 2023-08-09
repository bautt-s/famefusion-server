import { ApolloServer } from '@apollo/server'
import kindeNode from '@kinde-oss/kinde-node'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './types.js'
import { celebrityMutation, celebrityQuery } from './resolvers/celebrity.js'
import { fanQuery, fanMutation } from './resolvers/fan.js'
import { businessMutation, businessQuery } from './resolvers/business.js'
import { reviewMutation, reviewQuery } from './resolvers/review.js'
import { workMutation } from './resolvers/work.js'
import { resolverMap } from './resolvers/date.js'
import { userMutation, userQuery } from './resolvers/user.js'

(async function () {
    const authorize = await kindeNode(process.env.KINDE_DOMAIN)

    const resolvers = {
        Date: resolverMap,

        Query: {
            ...userQuery,
            ...celebrityQuery,
            ...fanQuery,
            ...businessQuery,
            ...reviewQuery
        },

        Mutation: {
            ...userMutation,
            ...celebrityMutation,
            ...fanMutation,
            ...businessMutation,
            ...reviewMutation,
            ...workMutation
        }
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers
    })

    const { url } = await startStandaloneServer(server, {
        listen: { port: 3001 },
        /*context: async ({ req }) => {
            // auth check on every request
            const user = await new Promise((resolve, reject) => {
                authorize(req, (err: any, user: any) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(user);
                });
            });
        
            return {
                user
            };
        }*/
    })

    console.log('Server listening at ' + url)
})()