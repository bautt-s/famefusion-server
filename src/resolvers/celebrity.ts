import { prisma } from "../../prisma/db";

interface filterArgs {
    location: string
    price: [number, number]
    availability: [Date, Date]
    ageGroup: [number, number]
    gender: string[],
    languages: string[],
    interests: string[],
    opportunities: string[],
}

interface createArgs {
    id?: string,
    name: string,
    email: string,
    location: string,
    nickname: string,
    biography: string,
    description: string,
    associatedBrands: string[],
    categories: string[],
    age: number,
    gender: string,
    languages: string[],
    interests: string[],
    media: string[],
    rating?: number,
    profilePic?: string,
    userId: string
    locationVerified?: boolean,
    celebrityVerified?: boolean
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
                    workList: true,
                    associatedUser: true,
                    reviewList: true,
                }
            })

            if (celebrities.length) return celebrities
            else 'Could not find any celebrities.'
        } catch (err) {
            throw 'There was an unexpected error.'
        }
    },

    getCelebrityById: async (_parent: any, args: { id: string }) => {
        try {
            const celebrity = await prisma.celebrity.findUnique({
                where: {
                    id: args.id
                }
            })

            return celebrity ?? 'Could not find celebrity.'
        } catch (err) {
            throw 'There was an unexpected error.'
        }
    },

    getFilteredCelebrities: async (_parent: any, args: filterArgs) => {
        try {
            const celebrities = await prisma.celebrity.findMany({
                where: {
                    languages: {
                        hasSome: args.languages
                    },

                    interests: {
                        hasSome: args.interests
                    },

                    gender: {
                        in: args.gender
                    },

                    availableDays: {
                        some: {
                            date: {
                                gte: args.availability[0],
                                lte: args.availability[1]
                            }
                        }
                    },

                    workList: {
                        some: {
                            type: {
                                in: args.opportunities
                            },

                            price: {
                                gte: args.price[0],
                                lte: args.price[1]
                            }
                        }
                    },

                    age: {
                        gte: args.ageGroup[0],
                        lte: args.ageGroup[1]
                    },

                    location: args.location
                },

                orderBy: {
                    name: "asc"
                },

                include: {
                    workList: true,
                    associatedUser: true,
                    reviewList: true,
                }
            })

            if (celebrities.length) return celebrities
            else 'Could not find any celebrities.'
        } catch (err) {
            throw 'There was an unexpected error.'
        }
    }
}

export const celebrityMutation = {
    createCelebrity: async (_parent: any, args: createArgs) => {
        try {
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
                rating,
                profilePic,
                userId
            } = args;

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
                    rating,
                    profilePic,
                    userId
                }
            })
        } catch (err) {
            throw 'There was an unexpected error.'
        }
    },

    editCelebrity: async (_parent: any, args: createArgs) => {
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
                rating,
                profilePic,
                userId,
                locationVerified,
                celebrityVerified
            } = args;

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
                    rating,
                    profilePic,
                    userId,
                    locationVerified,
                    celebrityVerified
                }
            })
        } catch (err) {
            throw 'There was an unexpected error.'
        }
    },

    deleteCelebrity: (_parent: any, args: { id: string }) => {
        try {
            const { id } = args

            return prisma.celebrity.delete({
                where: { id }
            })
        } catch (err) {
            throw 'There was an unexpected error.'
        }
    }
}