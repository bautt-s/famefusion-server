import { prisma } from "../../prisma/db.js"

interface updateWork {
    work: {
        id?: string,
        title?: string,
        type?: string,
        price?: number,
        description?: string,
        duration?: string,
        online?: boolean,
        collaboration?: boolean,
        celebrityId?: string,
    }
}

export const workMutation = {
    createWork: async (_parent: any, args: updateWork) => {
        try {
            const { title, type, price, description, duration, 
            online, collaboration, celebrityId } = args.work

            return await prisma.work.create({
                data: {
                    title,
                    type,
                    price,
                    description,
                    duration,
                    online,
                    collaboration,
                    celebrityId
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateWork: async (_parent: any, args: updateWork) => {
        try {
            const { id, title, type, price, description,
            online, collaboration,  duration } = args.work

            return await prisma.work.update({
                where: {
                    id
                },

                data: {
                    title,
                    type,
                    price,
                    description,
                    duration,
                    online,
                    collaboration
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    deleteWork: async (_parent: any, args: { id: string }) => {
        try {
            return await prisma.work.delete({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw { err }
        }
    }
}