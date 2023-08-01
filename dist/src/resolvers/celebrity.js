import { prisma } from "../../prisma/db.js";
export const celebrityQuery = {
    getAllCelebrities: async (_parent, args) => {
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
            });
            if (celebrities.length)
                return celebrities;
            else
                'Could not find any celebrities.';
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    getCelebrityById: async (_parent, args) => {
        try {
            const celebrity = await prisma.celebrity.findUnique({
                where: {
                    id: args.id
                }
            });
            return celebrity ?? 'Could not find celebrity.';
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    getFilteredCelebrities: async (_parent, args) => {
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
                    workList: true,
                    associatedUser: true,
                    reviewList: true,
                }
            });
            if (celebrities.length)
                return celebrities;
            else
                'Could not find any celebrities.';
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    }
};
export const celebrityMutation = {
    createCelebrity: async (_parent, args) => {
        try {
            const { name, email, location, nickname, biography, description, associatedBrands, categories, age, gender, languages, interests, media, rating, profilePic, userId } = args.celebrity;
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
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    updateCelebrity: async (_parent, args) => {
        try {
            const { id, name, email, location, nickname, biography, description, associatedBrands, categories, age, gender, languages, interests, media, rating, profilePic, userId, locationVerified, celebrityVerified } = args.celebrity;
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
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    createDay: async (_parent, args) => {
        try {
            const { date, celebrityId } = args.day;
            return await prisma.day.create({
                data: {
                    id: celebrityId + '-' + date.toDateString(),
                    date,
                    celebrityId
                }
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    deleteDay: async (_parent, args) => {
        try {
            const { date, celebrityId } = args;
            return await prisma.day.delete({
                where: {
                    id: celebrityId + '-' + date.toDateString()
                }
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    deleteCelebrity: (_parent, args) => {
        try {
            const { id } = args;
            return prisma.celebrity.delete({
                where: { id }
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    }
};
