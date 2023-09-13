import { prisma } from "../../prisma/db.js"
import cloudinary from "../cloudinary.js"

interface updateFan {
    fan: {
        id?: string,
        name?: string,
        email?: string,
        location?: string,
        birthYear?: Date,
        interests?: string[],
        userId?: string,
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

export const fanQuery = {
    getAllFans: async () => {
        try {
            return await prisma.fan.findMany({
                include: {
                    reviewList: true,
                    user: true,
                    savedCelebrities: {
                        include: {
                            workList: true,
                            associatedUser: true
                        }
                    }
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    getFanById: async (_parent: any, args: { id: string }) => {
        try {
            const fan = await prisma.fan.findUnique({
                where: {
                    id: args.id
                },

                include: {
                    reviewList: true,
                    user: true,
                    savedCelebrities: {
                        include: {
                            workList: true,
                            associatedUser: true
                        }
                    }
                }
            })

            return fan ?? 'Fan could not be found.'
        } catch (err) {
            throw { err }
        }
    },
}

export const fanMutation = {
    createFan: async (_parent: any, args: updateFan, context: any) => {
        try {
            //if (!context.user) throw 'USER_NOT_AUTHENTICATED'

            const { name, email, location, birthYear, interests, selfieImg,
            userId, locationImg, identityImg, websiteLink, tiktokLink,
            facebookLink, twitterLink, instagramLink, youtubeLink } = args.fan

            // upload verification files to cloudinary
            const identityCloudinary = selfieImg ? await cloudinary.uploader.upload(selfieImg, {
                public_id: email,
                folder: 'fanIdentities',
            }) : undefined

            const selfieCloudinary = identityImg ? await cloudinary.uploader.upload(identityImg, {
                public_id: email,
                folder: 'fanSelfies',
            }) : undefined

            const locationCloudinary = locationImg ? await cloudinary.uploader.upload(locationImg, {
                public_id: email,
                folder: 'fanLocations',
            }) : undefined

            return await prisma.fan.create({
                data: {
                    name,
                    email,
                    location,
                    birthYear,
                    interests,
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

    updateFan: async (_parent: any, args: updateFan) => {
        try {
            const { id, name, email, location, birthYear, interests, selfieImg, locationImg,
            locationVerified, identityVerified, selfieVerified, identityImg, websiteLink, tiktokLink,
            facebookLink, twitterLink, instagramLink, youtubeLink } = args.fan

            // upload verification files to cloudinary
            const identityCloudinary = identityImg ? await cloudinary.uploader.upload(selfieImg, {
                public_id: email,
                folder: 'fanIdentities',
            }) : undefined

            const selfieCloudinary = selfieImg ? await cloudinary.uploader.upload(identityImg, {
                public_id: email,
                folder: 'fanSelfies',
            }) : undefined

            const locationCloudinary = locationImg ? await cloudinary.uploader.upload(locationImg, {
                public_id: email,
                folder: 'fanLocations',
            }) : undefined

            return await prisma.fan.update({
                where: { id },

                data: {
                    name: name || undefined,
                    email: email || undefined,
                    location: location || undefined,
                    birthYear: birthYear || undefined,
                    interests: interests || undefined,
                    locationVerified: locationVerified || undefined,
                    identityVerified: identityVerified || undefined,
                    selfieVerified: selfieVerified || undefined,
                    locationImg: locationCloudinary?.url,
                    selfieImg: selfieCloudinary?.url,
                    identityImg: identityCloudinary?.url,
                    websiteLink: websiteLink !== undefined ? websiteLink : undefined,
                    tiktokLink: tiktokLink !== undefined ? tiktokLink : undefined,
                    youtubeLink: youtubeLink !== undefined ? youtubeLink : undefined,
                    instagramLink: instagramLink !== undefined ? instagramLink : undefined,
                    facebookLink: facebookLink !== undefined ? facebookLink : undefined,
                    twitterLink: twitterLink !== undefined ? twitterLink : undefined,
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    addToWishlist: async (_parent: any, args: { ids: { id: string, celId: string }}) => {
        try {
            const { id, celId } = args.ids

            await prisma.celebrity.update({
                where: { id: celId },
                data: {
                    savedBy: {
                        connect: { id }
                    }
                }
            })

            return await prisma.fan.update({
                where: { id },

                data: {
                    savedCelebrities: {
                        connect: { id: celId }
                    }
                }
            })
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    removeFromWishlist: async (_parent: any, args: { ids: { id: string, celId: string }}) => {
        try {
            const { id, celId } = args.ids

            await prisma.celebrity.update({
                where: { id: celId },

                data: {
                    savedBy: {
                        disconnect: { id }
                    }
                }
            })

            return await prisma.fan.update({
                where: { id },

                data: {
                    savedCelebrities: {
                        disconnect: { id: celId }
                    }
                }
            })
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    deleteFan: async (_parent: any, args: { id: string }) => {
        try {
            return await prisma.fan.delete({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw { err }
        }
    },
}