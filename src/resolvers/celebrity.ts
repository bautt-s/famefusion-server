import { prisma } from "../../prisma/db.js";

interface filterArgs {
    filter: {
        location?: string
        price?: [number, number]
        availability?: [Date, Date]
        ageGroup?: [number, number]
        gender?: string[],
        languages?: string[],
        interests?: string[],
        opportunities?: string[],
    }
}

interface createArgs {
    celebrity: {
        id?: string,
        name?: string,
        email?: string,
        location?: string,
        nickname?: string,
        biography?: string,
        description?: string,
        associatedBrands?: string[],
        categories?: string[],
        age?: number,
        gender?: string,
        languages?: string[],
        interests?: string[],
        media?: string[],
        video?: string,
        rating?: number,
        profilePic?: string,
        userId?: string
        locationVerified?: boolean,
        celebrityVerified?: boolean
    }
}

interface createDay {
    day: { 
        date?: Date, 
        celebrityId?: string 
    }
}

export const celebrityQuery = {
    getAllCelebrities: async (_parent: any, args?: { name?: string }) => {
        try {
            const celebrities = await prisma.celebrity.findMany({
                where: {
                    name: {
                        contains: args.name || '',
                        mode: 'insensitive'
                    }
                },

                orderBy: {
                    name: "asc"
                },

                include: {
                    workList: {
                        orderBy: { 
                            price: 'asc' 
                        }
                    },
                    associatedUser: true,
                    reviewList: true,
                }
            })

            if (celebrities.length) return celebrities
            else 'Could not find any celebrities.'
        } catch (err) {
            throw { err }
        }
    },

    getCelebrityById: async (_parent: any, args: { id: string }) => {
        try {
            const celebrity = await prisma.celebrity.findUnique({
                where: {
                    id: args.id
                },

                include: {
                    workList: {
                        orderBy: { 
                            price: 'asc' 
                        }
                    },
                    associatedUser: true,
                    reviewList: true,
                }
            })

            return celebrity ?? 'Could not find celebrity.'
        } catch (err) {
            throw { err }
        }
    },

    getFilteredCelebrities: async (_parent: any, args: filterArgs) => {
        try {
            const celebrities = await prisma.celebrity.findMany({
                where: {
                    languages: {
                        hasSome: args.filter.languages
                    },

                    interests: {
                        hasSome: args.filter.interests
                    },

                    gender: {
                        in: args.filter.gender
                    },

                    availableDays: {
                        some: {
                            date: {
                                gte: args.filter.availability[0],
                                lte: args.filter.availability[1]
                            }
                        }
                    },

                    workList: {
                        some: {
                            type: {
                                in: args.filter.opportunities
                            },

                            price: {
                                gte: args.filter.price[0],
                                lte: args.filter.price[1]
                            }
                        }
                    },

                    age: {
                        gte: args.filter.ageGroup[0],
                        lte: args.filter.ageGroup[1]
                    },

                    location: args.filter.location
                },

                orderBy: {
                    name: "asc"
                },

                include: {
                    workList: {
                        orderBy: { 
                            price: 'asc' 
                        }
                    },
                    associatedUser: true,
                    reviewList: true,
                }
            })

            if (celebrities.length) return celebrities
            else 'Could not find any celebrities.'
        } catch (err) {
            throw { err }
        }
    },
}

export const celebrityMutation = {
    createCelebrity: async (_parent: any, args: createArgs, context: any) => {
        try {
            //if (!context.user) throw 'USER_NOT_AUTHENTICATED'

            const {
                name,
                email,
                location,
                nickname,
                biography,
                description,
                associatedBrands,
                categories,
                age,
                gender,
                languages,
                interests,
                media,
                video,
                rating,
                profilePic,
                userId
            } = args.celebrity;

            return await prisma.celebrity.create({
                data: {
                    name,
                    email,
                    location,
                    nickname,
                    biography,
                    description,
                    associatedBrands,
                    categories,
                    age,
                    gender,
                    languages,
                    interests,
                    media,
                    video,
                    rating,
                    profilePic,
                    userId
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateCelebrity: async (_parent: any, args: createArgs) => {
        try {
            const {
                id,
                name,
                email,
                location,
                nickname,
                biography,
                description,
                associatedBrands,
                categories,
                age,
                gender,
                languages,
                interests,
                media,
                video,
                rating,
                profilePic,
                userId,
                locationVerified,
                celebrityVerified
            } = args.celebrity;

            return await prisma.celebrity.update({
                where: { id },

                data: {
                    name,
                    email,
                    location,
                    nickname,
                    biography,
                    description,
                    associatedBrands,
                    categories,
                    age,
                    gender,
                    languages,
                    interests,
                    media,
                    video,
                    rating,
                    profilePic,
                    userId,
                    locationVerified,
                    celebrityVerified
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    createDay: async (_parent: any, args: createDay) => {
        try {
            const { date, celebrityId } = args.day

            return await prisma.day.create({
                data: {
                    id: celebrityId+'-'+date.toDateString(),
                    date,
                    celebrityId
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    deleteDay: async (_parent: any, args: { date: Date, celebrityId: string }) => {
        try {
            const { date, celebrityId } = args

            return await prisma.day.delete({
                where: {
                    id: celebrityId+'-'+date.toDateString()
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    deleteCelebrity: (_parent: any, args: { id: string }) => {
        try {
            const { id } = args

            return prisma.celebrity.delete({
                where: { id }
            })
        } catch (err) {
            throw { err }
        }
    }
}