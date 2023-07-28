import { prisma } from './db.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
(async function () {
    const typeDefs = gql `
        type Post {
            id: String
            title: String
            username: String
        }

        type Query {
            getAllPosts: [Post]
        }

        type Mutation {
            createPost(title: String, username: String): Post
        }
    `;
    const resolvers = {
        Query: {
            getAllPosts: async () => {
                return await prisma.post.findMany();
            }
        },
        Mutation: {
            createPost: async (_parent, args) => {
                const post = await prisma.post.create({
                    data: {
                        title: args.title,
                        username: args.username
                    }
                });
                return post;
            }
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
