import { prisma } from "../../prisma/db.js";

interface updateReview {
    review: {
        id?: string,
        title?: string,
        date?: Date,
        description?: string,
        images?: string[],
        stars?: number,
        celebrityId?: string,
        authorId?: string,  
    }
}

export const reviewQuery = {
    getAllReviews: async () => {
        try {
            return await prisma.review.findMany({
                include: {
                    celebrity: true,
                    author: true
                }
            })
        } catch (err) {
            throw { err }
        }
    }
}

export const reviewMutation = {
    createReview: async (_parent: any, args: updateReview) => {
        try {
            const { title, date, description, images, stars, celebrityId, authorId } = args.review

            return await prisma.review.create({
                data: {
                    title,
                    date,
                    description,
                    images,
                    stars,
                    celebrityId,
                    authorId
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    updateReview: async (_parent: any, args: updateReview) => {
        try {
            const { id, title, date, description, images, stars } = args.review

            return await prisma.review.update({
                where: { id },

                data: {
                    title,
                    date,
                    description,
                    images,
                    stars,
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    deleteReview: async (_parent: any, args: { id: string }) => {
        try {
            return await prisma.review.delete({
                where: {
                    id: args.id
                }
            })
        } catch (err) {
            throw { err }
        }
    }
}