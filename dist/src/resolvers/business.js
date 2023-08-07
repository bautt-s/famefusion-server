import { prisma } from "../../prisma/db.js";
export const businessQuery = {
    getAllBusinesses: async () => {
        try {
            return await prisma.business.findMany({
                include: {
                    associatedUser: true
                }
            });
        }
        catch (err) {
            throw { err };
        }
    },
    getBusinessById: async (_parent, args) => {
        try {
            const business = await prisma.business.findUnique({
                where: {
                    id: args.id
                },
                include: {
                    associatedUser: true
                }
            });
            return business ?? 'Business could not be found.';
        }
        catch (err) {
            throw { err };
        }
    },
};
export const businessMutation = {
    createBusiness: async (_parent, args, context) => {
        try {
            if (!context.user)
                throw 'USER_NOT_AUTHENTICATED';
            const { name, email, location, businessEmail, description, categories, businessVerified, userId, images, profilePic } = args.business;
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
            });
        }
        catch (err) {
            throw { err };
        }
    },
    updateBusiness: async (_parent, args) => {
        try {
            const { id, name, email, location, businessEmail, description, categories, businessVerified, images, profilePic } = args.business;
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
            });
        }
        catch (err) {
            throw { err };
        }
    },
    deleteBusiness: async (_parent, args) => {
        try {
            return await prisma.business.delete({
                where: {
                    id: args.id
                }
            });
        }
        catch (err) {
            throw { err };
        }
    },
};
