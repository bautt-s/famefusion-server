import { gql } from 'graphql-tag'

export const typeDefs = gql`
        type Celebrity {
            id: String
            name: String
            email: String
            location: String
            nickname: String
            biography: String
            description: String
            associatedBrands: String[]
            categories: String[]
            age: Int
            gender: String
            languages: String[]
            interests: String[]
            media: String[]
            rating: Float
            profilePic: String
            userId: String
            locationVerified: Boolean
            celebrityVerified: Boolean
        }

        type Query {
            getAllPosts(name: String): [Celebrity]
            getCelebrityById(id: String): Celebrity
            getFilteredCelebrities(args: Celebrity): [Celebrity]
        }

        type Mutation {
            createCelebrity(args: Celebrity, title: String): Post
            editCelebrity(args: Celebrity, id: String): Post
            deleteCelebrity(id: String): Post
        }
`