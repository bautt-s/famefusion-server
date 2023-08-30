import { prisma } from "../../prisma/db.js"

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
        fanVerified?: boolean,
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

            const { name, email, location, birthYear, interests,
                profilePic, userId, locationVerified, fanVerified } = args.fan

            return await prisma.fan.create({
                data: {
                    name,
                    email,
                    location,
                    birthYear,
                    interests,
                    profilePic,
                    userId,
                    locationVerified,
                    fanVerified,
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateFan: async (_parent: any, args: updateFan) => {
        try {
            const { id, name, email, location, birthYear, interests,
                profilePic, locationVerified, fanVerified } = args.fan

            return await prisma.fan.update({
                where: { id },

                data: {
                    name,
                    email,
                    location,
                    birthYear,
                    interests,
                    profilePic,
                    locationVerified,
                    fanVerified,
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