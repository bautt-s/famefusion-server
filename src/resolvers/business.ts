import { prisma } from "../../prisma/db.js"

interface updateBusiness {
    business: {
        id?: string,
        name?: string,
        email?: string,
        businessEmail?: string,
        location?: string,
        description?: string,
        categories?: string[],
        businessVerified?: boolean,
        userId?: string,
        images?: string[],
        profilePic?: string
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

            return business ?? 'Business could not be found.'
        } catch (err) {
            throw { err }
        }
    },
}

export const businessMutation = {
    createBusiness: async (_parent: any, args: updateBusiness, context: any) => {
        try {
            if (!context.user) throw 'USER_NOT_AUTHENTICATED'

            const { name, email, location, businessEmail, description, categories,
                businessVerified, userId, images, profilePic } = args.business

            return await prisma.business.create({
                data: {
                    name,
                    email,
                    location,
                    businessEmail,
                    description,
                    categories,
                    businessVerified,
                    userId,
                    images,
                    profilePic,
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateBusiness: async (_parent: any, args: updateBusiness) => {
        try {
            const { id, name, email, location, businessEmail, description,
                categories, businessVerified, images, profilePic } = args.business

            return await prisma.business.update({
                where: { id },

                data: {
                    name,
                    email,
                    location,
                    businessEmail,
                    description,
                    categories,
                    businessVerified,
                    images,
                    profilePic,
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