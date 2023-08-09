import { prisma } from '../../prisma/db.js';
export const userQuery = {
    getAllUsers: async () => {
        try {
            return await prisma.user.findMany({});
        }
        catch (err) {
            throw { err };
        }
    },
    getUserById: async (_parent, args, context) => {
        try {
            if (!context.user)
                throw 'USER_NOT_AUTHENTICATED';
            return await prisma.user.findUnique({
                where: {
                    id: args.id
                }
            });
        }
        catch (err) {
            throw { err };
        }
    }
};
export const userMutation = {
    createUser: async (_parent, args) => {
        try {
            const { name, email, role } = args.user;
            console.log(name);
            return await prisma.user.create({
                data: {
                    name,
                    email,
                    role
                }
            });
        }
        catch (err) {
            throw { err };
        }
    },
    updateUser: async (_parent, args) => {
        try {
            const { id, name, email, role } = args.user;
            return await prisma.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    role
                }
            });
        }
        catch (err) {
            throw { err };
        }
    },
    deleteUser: async (_parent, args) => {
        try {
            return await prisma.user.delete({
                where: {
                    id: args.id
                }
            });
        }
        catch (err) {
            throw { err };
        }
    }
};
