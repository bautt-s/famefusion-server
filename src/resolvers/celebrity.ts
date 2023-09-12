import { prisma } from "../../prisma/db.js";
import cloudinary from "../cloudinary.js";

interface filterArgs {
    filter: {
        location?: string
        price?: {
            range: boolean,
            min: number,
            max: number,
        }
        availability?: {
            startDate: Date,
            endDate: Date
        }
        ageGroup?: [number, number]
        gender?: string[],
        languages?: string[],
        interests?: string[],
        opportunities?: string[],
        name?: string,
        category?: string
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
        birthYear?: Date,
        gender?: string,
        languages?: string[],
        interests?: string[],
        media?: string[],
        rating?: number,
        userId?: string
        locationVerified?: boolean,
        identityVerified?: boolean,
        selfieVerified?: boolean,
        selfieImg?: string,
        locationImg?: string,
        identityImg?: string,
        websiteLink?: string,
        instagramLink?: string,
        tiktokLink?: string,
        facebookLink?: string,
        twitterLink?: string,
        youtubeLink?: string,
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
            console.log(err)
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
            console.log(err)
            throw { err }
        }
    },

    getFilteredCelebrities: async (_parent: any, args: filterArgs) => {
        try {
            const celebrities = await prisma.celebrity.findMany({
                where: {
                    languages: args.filter.languages.length ? {
                        hasSome: args.filter.languages
                    } : undefined,

                    interests: args.filter.interests.length ? {
                        hasSome: args.filter.interests
                    } : undefined,

                    gender: args.filter.gender.length ? {
                        in: args.filter.gender
                    } : undefined,

                    availableDays: args.filter.availability.startDate || args.filter.availability.endDate ? {
                        some: {
                            date: {
                                gte: args.filter.availability.startDate || undefined,
                                lte: args.filter.availability.endDate || undefined
                            }
                        }
                    } : undefined,

                    workList: args.filter.opportunities.length || args.filter.price.range ? {
                        some: {
                            type: args.filter.opportunities.length ? {
                                in: args.filter.opportunities
                            } : undefined,

                            price: args.filter.price.range ? {
                                gte: args.filter.price.min,
                                lte: args.filter.price.max
                            } : undefined
                        }
                    } : undefined,

                    location: args.filter.location || undefined,

                    categories: args.filter.category.length ? {
                        has: args.filter.category
                    } : undefined,

                    name: {
                        contains: args.filter.name.length ? args.filter.name : '',
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
            console.log(err)
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
                birthYear,
                gender,
                languages,
                interests,
                media,
                rating,
                userId,
                selfieImg,
                locationImg,
                identityImg, 
                websiteLink, 
                tiktokLink,
                facebookLink, 
                twitterLink, 
                instagramLink, 
                youtubeLink
            } = args.celebrity;

            // upload media array images to cloudinary
            const mediaCloudinary = <string[]>[];

            media.map(async (image) => {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'celebritiesImgs',
                    resource_type: 'auto',
                })

                mediaCloudinary.push(result.url)
            })

            // upload verification files to cloudinary
            const identityCloudinary = selfieImg ? await cloudinary.uploader.upload(selfieImg, {
                folder: 'celebrityIdentities',
            }) : undefined

            const selfieCloudinary = identityImg ? await cloudinary.uploader.upload(identityImg, {
                folder: 'celebritySelfies',
            }) : undefined

            const locationCloudinary = locationImg ? await cloudinary.uploader.upload(locationImg, {
                folder: 'celebrityLocations',
            }) : undefined

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
                    birthYear,
                    gender,
                    languages,
                    interests,
                    media: mediaCloudinary,
                    rating,
                    userId,
                    locationImg: locationCloudinary?.url,
                    selfieImg: selfieCloudinary?.url,
                    identityImg: identityCloudinary?.url,
                    websiteLink,
                    tiktokLink,
                    youtubeLink,
                    instagramLink,
                    facebookLink,
                    twitterLink
                }
            })
        } catch (err) {
            console.log(err)
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
                birthYear,
                gender,
                languages,
                interests,
                media,
                rating,
                userId,
                locationVerified,
                identityVerified,
                selfieVerified,
                selfieImg,
                locationImg,
                identityImg,
                websiteLink,
                tiktokLink,
                youtubeLink,
                instagramLink,
                facebookLink,
                twitterLink
            } = args.celebrity;

            // upload verification files to cloudinary
            const identityCloudinary = identityImg ? await cloudinary.uploader.upload(selfieImg, {
                folder: 'celebrityIdentities',
            }) : undefined

            const selfieCloudinary = selfieImg ? await cloudinary.uploader.upload(identityImg, {
                folder: 'celebritySelfies',
            }) : undefined

            const locationCloudinary = locationImg ? await cloudinary.uploader.upload(locationImg, {
                folder: 'celebrityLocations',
            }) : undefined

            return await prisma.celebrity.update({
                where: { id },

                data: {
                    name: name || undefined,
                    email: email || undefined,
                    location: location || undefined,
                    nickname: nickname || undefined,
                    biography: biography || undefined,
                    description: description || undefined,
                    associatedBrands: associatedBrands || undefined,
                    categories: categories || undefined,
                    birthYear: birthYear || undefined,
                    gender: gender || undefined,
                    languages: languages || undefined,
                    interests: interests || undefined,
                    media: media || undefined,
                    rating: rating || undefined,
                    userId: userId || undefined,
                    locationVerified: locationVerified || undefined,
                    identityVerified: identityVerified || undefined,
                    selfieVerified: selfieVerified || undefined,
                    locationImg: locationCloudinary?.url,
                    selfieImg: selfieCloudinary?.url,
                    identityImg: identityCloudinary?.url,
                    websiteLink: websiteLink || undefined,
                    tiktokLink: tiktokLink || undefined,
                    youtubeLink: youtubeLink || undefined,
                    instagramLink: instagramLink || undefined,
                    facebookLink: facebookLink || undefined,
                    twitterLink: twitterLink || undefined,
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
                    id: celebrityId + '-' + date.toDateString(),
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
                    id: celebrityId + '-' + date.toDateString()
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