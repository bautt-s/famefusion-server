import { prisma } from "../../prisma/db.js"
import cloudinary from "../cloudinary.js"

interface updateBusiness {
    business: {
        id?: string,
        name?: string,
        email?: string,
        businessEmail?: string,
        location?: string,
        description?: string,
        categories?: string[],
        userId?: string,
        profilePic?: string,
        identityVerified?: boolean,
        selfieVerified?: boolean,
        selfieImg?: string,
        identityImg?: string
    }
}

export const businessQuery = {
    getAllBusinesses: async () => {
        try {
            return await prisma.business.findMany({
                include: {
                    associatedUser: true
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    getBusinessById: async (_parent: any, args: { id: string }) => {
        try {
            const business = await prisma.business.findUnique({
                where: {
                    id: args.id
                },

                include: {
                    associatedUser: true
                }
            })

            return business || 'Business could not be found.'
        } catch (err) {
            throw { err }
        }
    },
}

export const businessMutation = {
    createBusiness: async (_parent: any, args: updateBusiness, context: any) => {
        try {
            //if (!context.user) throw 'USER_NOT_AUTHENTICATED'

            const { name, email, location, businessEmail, description, categories,
            userId, profilePic, selfieImg, identityImg } = args.business

            // upload profile pic img to cloudinary
            const profilePicCloudinary = await cloudinary.uploader.upload(profilePic, {
                folder: 'businessPP',
            })

            // upload verification files to cloudinary
            const identityCloudinary = await cloudinary.uploader.upload(selfieImg, {
                folder: 'businessIdentities',
            })

            const selfieCloudinary = await cloudinary.uploader.upload(identityImg, {
                folder: 'businessSelfies',
            })

            return await prisma.business.create({
                data: {
                    name,
                    email,
                    location,
                    businessEmail,
                    description,
                    categories,
                    userId,
                    profilePic: profilePicCloudinary.url,
                    selfieImg: selfieCloudinary.url,
                    identityImg: identityCloudinary.url
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateBusiness: async (_parent: any, args: updateBusiness) => {
        try {
            const { id, name, email, location, businessEmail, description, selfieVerified,
                categories, identityVerified, profilePic, selfieImg, identityImg } = args.business

            // upload profile pic img to cloudinary
            const profilePicCloudinary = profilePic ? await cloudinary.uploader.upload(profilePic, {
                folder: 'businessPP',
            }) : undefined

            // upload verification files to cloudinary
            const identityCloudinary = selfieImg ? await cloudinary.uploader.upload(selfieImg, {
                folder: 'businessIdentities',
            }) : undefined

            const selfieCloudinary = identityImg ? await cloudinary.uploader.upload(identityImg, {
                folder: 'businessSelfies',
            }) : undefined

            return await prisma.business.update({
                where: { id },

                data: {
                    name: name || undefined,
                    email: email || undefined,
                    location: location || undefined,
                    businessEmail: businessEmail || undefined,
                    description: description || undefined,
                    categories: categories || undefined,
                    identityVerified: identityVerified || undefined,
                    selfieVerified: selfieVerified || undefined,
                    profilePic: profilePicCloudinary?.url,
                    selfieImg: selfieCloudinary?.url,
                    identityImg: identityCloudinary?.url
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    deleteBusiness: async (_parent: any, args: { id: string }) => {
        try {
            return await prisma.business.delete({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw { err }
        }
    },
}