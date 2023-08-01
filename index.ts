import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './src/types.js'
import { celebrityMutation, celebrityQuery } from './src/resolvers/celebrity.js'
import { fanQuery, fanMutation } from './src/resolvers/fan.js'
import { businessMutation, businessQuery } from './src/resolvers/business.js'
import { reviewMutation, reviewQuery } from './src/resolvers/review.js'
import { workMutation } from './src/resolvers/work.js'

( async function () {
    const resolvers = {
        Query: {
            ...celebrityQuery,
            ...fanQuery,
            ...businessQuery,
            ...reviewQuery
        },

        Mutation: {
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
        listen: { port: 3001 }
    })

    console.log('Server listening at ' + url)
})()