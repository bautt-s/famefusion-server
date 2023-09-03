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
        profilePic?: string,
        userId?: string,
        locationVerified?: boolean,
        identityVerified?: boolean,
        selfieVerified?: boolean,
        selfieImg?: string,
        locationImg?: string,
        identityImg?: string
    }
}

export const fanQuery = {
    getAllFans: async () => {
        try {
            return await prisma.fan.findMany({
                include: {
                    reviewList: true,
                    user: true
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
                    user: true
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
            profilePic, userId, locationImg, identityImg } = args.fan

            // upload profile pic img to cloudinary
            const profilePicCloudinary = await cloudinary.uploader.upload(profilePic, {
                folder: 'fanPP',
            })

            // upload verification files to cloudinary
            const identityCloudinary = await cloudinary.uploader.upload(selfieImg, {
                folder: 'fanIdentities',
            })

            const selfieCloudinary = await cloudinary.uploader.upload(identityImg, {
                folder: 'fanSelfies',
            })

            const locationCloudinary = await cloudinary.uploader.upload(locationImg, {
                folder: 'fanLocations',
            })

            return await prisma.fan.create({
                data: {
                    name,
                    email,
                    location,
                    birthYear,
                    interests,
                    profilePic: profilePicCloudinary.url,
                    userId,
                    locationImg: locationCloudinary.url,
                    selfieImg: selfieCloudinary.url,
                    identityImg: identityCloudinary.url
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateFan: async (_parent: any, args: updateFan) => {
        try {
            const { id, name, email, location, birthYear, interests, selfieImg, locationImg,
            profilePic, locationVerified, identityVerified, selfieVerified, identityImg } = args.fan

            const profilePicCloudinary = profilePic ? await cloudinary.uploader.upload(profilePic, {
                folder: 'fanPP',
            }) : undefined

            // upload verification files to cloudinary
            const identityCloudinary = identityImg ? await cloudinary.uploader.upload(selfieImg, {
                folder: 'fanIdentities',
            }) : undefined

            const selfieCloudinary = selfieImg ? await cloudinary.uploader.upload(identityImg, {
                folder: 'fanSelfies',
            }) : undefined

            const locationCloudinary = locationImg ? await cloudinary.uploader.upload(locationImg, {
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
                    profilePic: profilePicCloudinary?.url,
                    locationImg: locationCloudinary?.url,
                    selfieImg: selfieCloudinary?.url,
                    identityImg: identityCloudinary?.url
                }
            })
        } catch (err) {
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