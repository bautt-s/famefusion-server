import { prisma } from '../../prisma/db.js'

interface createReservation {
    reservation: {
        id: string,
        workId: string,
        fanId: string,
        reservationTime: Date
    }
}

export const reservationQuery = {
    getReservationById: async (_parent: any, args: { id: string }) => {
        try {
            const reservation = await prisma.reservation.findUnique({
                where: { id: args.id },

                include: {
                    fan: true,
                    work: true
                }
            })

            return reservation
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    getReservationByFan: async (_parent: any, args: { id: string }) => {
        try {
            const reservation = await prisma.reservation.findMany({
                where: { fanId: args.id },

                include: {
                    fan: true,
                    work: true
                }
            })

            return reservation
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },
}

export const reservationMutation = {
    createReservation: async (_parent: any, args: createReservation) => {
        try {
            const { id, workId, fanId, reservationTime } = args.reservation

            const reservation = await prisma.reservation.create({
                data: {
                    id,
                    workId,
                    fanId,
                    reservationTime
                }
            })

            return reservation
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    deleteReservation: async (_parent: any, args: { id: string }) => {
        try {
            const { id } = args

            const reservation = await prisma.reservation.delete({
                where: { id },
            })

            return reservation ? 'Deleted successfully' : 'Could not find record'
        } catch (err) {
            console.log(err)
            throw { err }
        }
    }
}