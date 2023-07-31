import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './src/types.js'
import { celebrityMutation, celebrityQuery } from './src/resolvers/celebrity.js'

( async function () {
    const resolvers = {
        Query: {
            ...celebrityQuery
        },

        Mutation: {
            ...celebrityMutation
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