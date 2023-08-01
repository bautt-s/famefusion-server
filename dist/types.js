import { gql } from 'graphql-tag';
export const typeDefs = gql `
        enum Role {
            User
            Admin
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
            age: Number
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

        type Query {
            getAllPosts(name: String): [Celebrity]
            getCelebrityById(id: String): Celebrity
            getFilteredCelebrities(filter: DataFilter): [Celebrity]

            getAllFans: [Fan]
            getFanById(id: string): Fan

            getAllBusinesses: [Business]
            getBusinessById(id: string): Business

            getAllReviews: [Review]
        }

        type Mutation {
            createCelebrity(celebrity: Celebrity): Celebrity
            updateCelebrity(celebrity: Celebrity): Celebrity
            deleteCelebrity(id: String): Celebrity
            createDay(day: Day): Day
            deleteDay(day: Day): Day

            createFan(fan: Fan): Fan
            updateFan(fan: Fan): Fan
            deleteFan(id: String): Fan

            createBusiness(business: Business): Business
            updateBusiness(business: Business): Business
            deleteBusiness(id: String): Business

            createReview(review: Review): Review
            updateReview(review: Review): Review
            deleteReview(id: String): Review

            createWork(work: Work): Work
            updateWork(work: Work): Work
            deleteWork(id: Work): Work
        }
`;
