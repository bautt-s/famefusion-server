import { prisma } from "../../prisma/db.js";
export const fanQuery = {
    getAllFans: async () => {
        try {
            return await prisma.fan.findMany({
                include: {
                    reviewList: true,
                    user: true
                }
            });
        }
        catch (err) {
            throw { err };
        }
    },
    getFanById: async (_parent, args) => {
        try {
            const fan = await prisma.fan.findUnique({
                where: {
                    id: args.id
                },
                include: {
                    reviewList: true,
                    user: true
                }
            });
            return fan ?? 'Fan could not be found.';
        }
        catch (err) {
            throw { err };
        }
    },
};
export const fanMutation = {
    createFan: async (_parent, args, context) => {
        try {
            //if (!context.user) throw 'USER_NOT_AUTHENTICATED'
            const { name, email, location, age, interests, profilePic, userId, locationVerified, fanVerified } = args.fan;
            return await prisma.fan.create({
                data: {
                    name,
                    email,
                    location,
                    age,
                    interests,
                    profilePic,
                    userId,
                    locationVerified,
                    fanVerified,
                }
            });
        }
        catch (err) {
            throw { err };
        }
    },
    updateFan: async (_parent, args) => {
        try {
            const { id, name, email, location, age, interests, profilePic, locationVerified, fanVerified } = args.fan;
            return await prisma.fan.update({
                where: { id },
                data: {
                    name,
                    email,
                    location,
                    age,
                    interests,
                    profilePic,
                    locationVerified,
                    fanVerified,
                }
            });
        }
        catch (err) {
            throw { err };
        }
    },
    deleteFan: async (_parent, args) => {
        try {
            return await prisma.fan.delete({
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
