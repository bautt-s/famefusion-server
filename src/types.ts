import { gql } from 'graphql-tag'

export const typeDefs = gql`
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
            profilePic: String
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
            gender: String
            birthYear: Date
            languages: [String]
            interests: [String]
            media: [String]
            video: String
            rating: Float
            userId: String
            availableDays: [Day]
            reviewList: [Review]
            workList: [Work]
            associatedUser: User
            locationVerified: Boolean
            identityVerified: Boolean
            selfieVerified: Boolean
            selfieImg: String
            identityImg: String
            locationImg: String
            websiteLink: String,
            instagramLink: String,
            tiktokLink: String,
            facebookLink: String,
            twitterLink: String,
            youtubeLink: String,
            savedIDs: [String],
            savedBy: [Fan]
            createdAt: Date
            updatedAt: Date
        }

        type Fan {
            id: String
            name: String
            email: String
            location: String
            interests: [String]
            user: User
            reviewList: [Review]
            userId: String
            birthYear: Date
            locationVerified: Boolean
            identityVerified: Boolean
            selfieVerified: Boolean
            selfieImg: String
            identityImg: String
            locationImg: String
            websiteLink: String
            instagramLink: String
            tiktokLink: String
            facebookLink: String
            twitterLink: String
            youtubeLink: String
            savedCelIDs: [String]
            savedCelebrities: [Celebrity]
            savedExpIDs: [String]
            savedExperiences: [Work]
            bookedExpIDs: [String]
            bookedExperiences: [Work]
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
            identityVerified: Boolean
            identityImg: String
            selfieVerified: Boolean
            selfieImg: String
            associatedUser: User
            userId: String
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
            productId: String
            priceId: String
            savedIDs: [String]
            savedBy: [Fan]
            bookedIDs: [String]
            bookedBy: [Fan]
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

        type Product {
            id: String,
            object: String,
            active: Boolean,
            created: Int,
            default_price: String,
            description: String,
            features: [String],
            images: [String],
            name: String
        }

        type Day {
            id: Int       
            celebrity: Celebrity 
            celebrityId: String    
            date: Date
        }

        input PriceInterface {
            range: Boolean
            min: Float
            max: Float
        }

        input AvailabilityInterface {
            startDate: Date
            endDate: Date
        }

        input DataFilter {
            location: String
            price: PriceInterface
            availability: AvailabilityInterface
            ageGroup: [Int]
            ageFilter: [String]
            gender: [String]
            languages: [String]
            interests: [String]
            opportunities: [String]
            category: String
            name: String
        }

        input UserInput {
            id: String
            name: String!
            email: String!
            role: Role
            profilePic: String
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
            birthYear: Date
            gender: String
            languages: [String]
            interests: [String]
            media: [String]
            rating: Float
            userId: String
            locationVerified: Boolean
            identityVerified: Boolean
            selfieImg: String
            locationImg: String
            identityImg: String
            websiteLink: String,
            instagramLink: String,
            tiktokLink: String,
            facebookLink: String,
            twitterLink: String,
            youtubeLink: String,
        }

        input FanInput {
            id: String
            name: String
            email: String
            location: String
            birthYear: Date
            interests: [String]
            userId: String
            locationVerified: Boolean
            identityVerified: Boolean
            selfieVerified: Boolean
            selfieImg: String
            locationImg: String
            identityImg: String
            websiteLink: String,
            instagramLink: String,
            tiktokLink: String,
            facebookLink: String,
            twitterLink: String,
            youtubeLink: String,
        }

        input BusinessInput {
            id: String
            name: String
            email: String
            businessEmail: String
            location: String
            description: String
            categories: [String]
            userId: String
            identityVerified: Boolean
            selfieVerified: Boolean
            selfieImg: String
            identityImg: String
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
            productId: String
        }

        input ReviewInput {
            id: String
            title: String
            type: String
            date: Date
            description: String
            images: [String]
            stars: Float
            celebrityId: String
            authorId: String, 
        }

        input DayInput {
            date: Date
            celebrityId: String
        }

        input WishlistInput {
            id: String
            celId: String
        }

        input ExperiencesInput {
            id: String
            workId: String
        }

        input ProductInput { 
            productId: String
            name: String
            description: String
            images: [String]
            unit_amount: Int
        }

        input PriceInput {
            priceId: String
            unit_amount: Int
        }

        input EnableInput {
            productId: String
            active: Boolean
        }

        type Query {
            getAllUsers: [User]
            getUserById(id: String): User
            getUserByEmail(email: String): User

            getAllCelebrities(name: String): [Celebrity]
            getCelebrityById(id: String): Celebrity
            getFilteredCelebrities(filter: DataFilter): [Celebrity]

            getAllFans: [Fan]
            getFanById(id: String): Fan

            getAllBusinesses: [Business]
            getBusinessById(id: String): Business

            getAllReviews: [Review]

            getWorkById(id: String): Work

            createCheckoutSession(price: String): String
            getProductById(productId: String): Product
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
            addToWishlist(ids: WishlistInput): Fan
            removeFromWishlist(ids: WishlistInput): Fan
            addToExperiences(ids: ExperiencesInput): Fan
            removeFromExperiences(ids: ExperiencesInput): Fan
            bookExperience(ids: ExperiencesInput): Fan
            unbookExperience(ids: ExperiencesInput): Fan
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

            createStripeProduct(product: ProductInput): Product
            updateStripeProduct(product: ProductInput): Product
            updateStripePrice(price: PriceInput): String
            activateStripeProduct(enable: EnableInput): String
        }
`