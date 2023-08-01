import { prisma } from '../../prisma/db.ts'

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
            throw 'There was an unexpected error.'
        }
    },

    getUserById: async (_parent, args: { id: string }) => {
        try {
            return await prisma.user.findUnique({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw 'There was an unexpected error.'
        }
    }
}

export const userMutation = {
    createUser: async (_parent: any, args: updateUser) => {
        try {
            const { name, email, role } = args.user

            return await prisma.user.create({
                data: {
                    name,
                    email,
                    role
                }
            })
        } catch (err) {
            throw 'There was an unexpected error.'
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
            throw 'There was an unexpected error.'
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
            throw 'There was an unexpected error.'
        }
    }
}   