import { prisma } from "../../prisma/db.js";
export const workMutation = {
    createWork: async (_parent, args) => {
        try {
            const { title, type, price, description, duration, online, collaboration, celebrityId } = args.work;
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
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    updateWork: async (_parent, args) => {
        try {
            const { id, title, type, price, description, online, collaboration, duration } = args.work;
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
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    },
    deleteWork: async (_parent, args) => {
        try {
            return await prisma.work.delete({
                where: {
                    id: args.id
                }
            });
        }
        catch (err) {
            throw 'There was an unexpected error.';
        }
    }
};
