import { prisma } from '../../prisma/db.js'

interface updateUser {
    user: {
        id: string,
        name: string,
        email: string,
        role: 'User' | 'Admin',
    }
}

export const userQuery = {
    getAllUsers: async () => {
        try {
            return await prisma.user.findMany({})
        } catch (err) {
            throw { err }
        }
    },

    getUserById: async (_parent: any, args: { id: string }, context: any) => {
        try {
            if (!context.user) throw 'USER_NOT_AUTHENTICATED'

            return await prisma.user.findUnique({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw { err }
        }
    }
}

export const userMutation = {
    createUser: async (_parent: any, args: updateUser) => {
        try {
            const { name, email, role } = args.user
            console.log(name)
            return await prisma.user.create({
                data: {
                    name,
                    email,
                    role
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateUser: async (_parent: any, args: updateUser) => {
        try {
            const { id, name, email, role } = args.user

            return await prisma.user.update({
                where: { id },    

                data: {
                    name,
                    email,
                    role
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    deleteUser: async (_parent: any, args: { id: string }) => {
        try {
            return await prisma.user.delete({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw { err }
        }
    }
}   