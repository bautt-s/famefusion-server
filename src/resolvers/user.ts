import { prisma } from '../../prisma/db.js'
import cloudinary from '../cloudinary.js'

interface updateUser {
    user: {
        id: string,
        name: string,
        email: string,
        role: 'User' | 'Admin',
        profilePic: string | undefined
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
            //if (!context.user) throw 'USER_NOT_AUTHENTICATED'

            return await prisma.user.findUnique({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    getUserByEmail: async (_parent: any, args: { email: string }) => {
        try {
            return await prisma.user.findUnique({
                where: {
                    email: args.email
                },

                include: {
                    associatedBusiness: true,
                    associatedCelebrity: true,
                    associatedFan: {
                        include: {
                            savedCelebrities: {
                                include: {
                                    workList: true,
                                    associatedUser: true
                                }
                            },
                            savedExperiences: true
                        }
                    }
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
            const { name, email, role, profilePic } = args.user
            
            const profilePicCloudinary = profilePic ? await cloudinary.uploader.upload(profilePic, {
                folder: 'userPic',
                public_id: email
            }) : undefined

            return await prisma.user.create({
                data: {
                    name,
                    email,
                    role,
                    profilePic: profilePicCloudinary?.url
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateUser: async (_parent: any, args: updateUser) => {
        try {
            const { id, name, email, role, profilePic } = args.user

            const profilePicCloudinary = profilePic ? await
            cloudinary.uploader.upload(profilePic, { public_id: email, folder: 'userPic' }, (error, result) => {
                if (error) {
                  console.error('Error uploading new image:', error);
                } else {
                  console.log('New image uploaded successfully.');
                }
              }) : undefined

            return await prisma.user.update({
                where: { id },    

                data: {
                    name,
                    email,
                    role,
                    profilePic: profilePicCloudinary?.url
                }
            })
        } catch (err) {
            console.log(err)
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