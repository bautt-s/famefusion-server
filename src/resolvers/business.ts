import { prisma } from "../../prisma/db"

interface updateBusiness {
    business: {
        id ?: string,
        name ?: string,
        email ?: string,
        businessEmail ?: string,
        location ?: string,
        description ?: string,
        categories ?: string[],
        businessVerified ?: boolean,
        userId ?: string,
        images ?: string[],
        profilePic ?: string
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
            throw 'There was an unexpected error.'
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
            throw 'There was an unexpected error.'
        }
    },
}

export const businessMutation = {
    createBusiness: async (_parent: any, args: updateBusiness) => {
        try {
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
            throw 'There was an unexpected error.'
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
            throw 'There was an unexpected error.'
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
            throw 'There was an unexpected error.'
        }
    },
}