import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './types.js';
import { celebrityMutation, celebrityQuery } from './resolvers/celebrity.js';
import { fanQuery, fanMutation } from './resolvers/fan.js';
import { businessMutation, businessQuery } from './resolvers/business.js';
import { reviewMutation, reviewQuery } from './resolvers/review.js';
import { workMutation } from './resolvers/work.js';
import { resolverMap } from './resolvers/date.js';
(async function () {
    const resolvers = {
        Date: resolverMap,
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
    };
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3001 }
    });
    console.log('Server listening at ' + url);
})();
