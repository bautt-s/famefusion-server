import { gql } from 'graphql-tag';
export const typeDefs = gql `
        enum Role {
            User
            Admin
        }

        scalar Date
    
        type MyType {
            created: Date
        }

        type User {
            id: String
            name: String
            email: String
            role: Role 
            associatedFan: Fan
            associatedCelebrity: Celebrity
            associatedBusiness: Business
            createdAt: Date   
            updatedAt: Date 
        }

        type Celebrity {
            id: String
            name: String
            email: String
            location: String
            nickname: String
            biography: String
            description: String
            associatedBrands: [String]
            categories: [String]
            age: Int
            gender: String
            languages: [String]
            interests: [String]
            media: [String]
            video: String
            rating: Float
            profilePic: String
            userId: String
            availableDays: [Day]
            reviewList: [Review]
            workList: [Work]
            associatedUser: User
            locationVerified: Boolean
            celebrityVerified: Boolean
            createdAt: Date
            updatedAt: Date
        }

        type Fan {
            id: String
            name: String
            email: String
            location: String
            age: Int
            interests: [String]
            associatedUser: User
            reviewList: [Review]
            profilePic: String
            userId: String
            locationVerified: Boolean
            fanVerified: Boolean
            createdAt: Date
            updatedAt: Date
        }

        type Business {
            id: String
            name: String
            email: String
            businessEmail: String
            location: String
            description: String
            categories: [String]
            businessVerified: Boolean
            associatedUser: User
            userId: String
            images: [String]
            profilePic: String
            createdAt: Date
            updatedAt: Date
        }

        type Work {
            id: String 
            title: String
            type: String
            price: Float
            description: String
            duration: String
            online: Boolean
            collaboration: Boolean
            celebrity: Celebrity 
            celebrityId: String 
            createdAt: Date  
            updatedAt: Date 
        }

        type Review {
            id: String 
            title: String
            date: Date
            description: String
            images: [String]
            stars: Float
            celebrity: Celebrity 
            celebrityId: String
            author: Fan     
            authorId: String
            createdAt: Date    
            updatedAt: Date    
        }

        type Day {
            id: Int       
            celebrity: Celebrity 
            celebrityId: String    
            date: Date
        }

        input DataFilter {
            location: String
            price: [Int]
            availability: [Date]
            ageGroup: [Int]
            gender: [String]
            languages: [String]
            interests: [String]
            opportunities: [String]
        }

        input UserInput {
            id: String
            name: String!
            email: String!
            role: Role
        }

        input CelebrityInput {
            id: String
            name: String
            email: String
            location: String
            nickname: String
            biography: String
            description: String
            associatedBrands: [String]
            categories: [String]
            age: Int
            gender: String
            languages: [String]
            interests: [String]
            media: [String]
            video: String
            rating: Float
            profilePic: String
            userId: String
            locationVerified: Boolean
            celebrityVerified: Boolean
        }

        input FanInput {
            id: String
            name: String
            email: String
            location: String
            age: Int
            interests: [String]
            profilePic: String
            userId: String
            locationVerified: Boolean
            fanVerified: Boolean
        }

        input BusinessInput {
            id: String
            name: String
            email: String
            businessEmail: String
            location: String
            description: String
            categories: [String]
            businessVerified: Boolean
            userId: String
            images: [String]
            profilePic: String
        }

        input WorkInput {
            id: String
            title: String
            type: String
            price: Float
            description: String
            duration: String
            online: Boolean
            collaboration: Boolean
            celebrityId: String
        }

        input ReviewInput {
            id: String,
            title: String,
            type: String,
            date: Date,
            description: String,
            images: [String],
            stars: Float,
            celebrityId: String,
            authorId: String,  
        }

        input DayInput {
            date: Date,
            celebrityId: String
        }

        type Query {
            getAllUsers: [User]
            getUserById(id: String): User

            getAllCelebrities(name: String): [Celebrity]
            getCelebrityById(id: String): Celebrity
            getFilteredCelebrities(filter: DataFilter): [Celebrity]

            getAllFans: [Fan]
            getFanById(id: String): Fan

            getAllBusinesses: [Business]
            getBusinessById(id: String): Business

            getAllReviews: [Review]
        }

        type Mutation {
            createUser(user: UserInput): User
            updateUser(user: UserInput): User
            deleteUser(id: String): User

            createCelebrity(celebrity: CelebrityInput): Celebrity
            updateCelebrity(celebrity: CelebrityInput): Celebrity
            deleteCelebrity(id: String): Celebrity
            createDay(day: DayInput): Day
            deleteDay(day: DayInput): Day

            createFan(fan: FanInput): Fan
            updateFan(fan: FanInput): Fan
            deleteFan(id: String): Fan

            createBusiness(business: BusinessInput): Business
            updateBusiness(business: BusinessInput): Business
            deleteBusiness(id: String): Business

            createReview(review: ReviewInput): Review
            updateReview(review: ReviewInput): Review
            deleteReview(id: String): Review

            createWork(work: WorkInput): Work
            updateWork(work: WorkInput): Work
            deleteWork(id: String): Work
        }
`;
