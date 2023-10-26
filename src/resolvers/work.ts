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

        timetable?: {
            months: string[],
            mondayTimes: string[]
            tuesdayTimes: string[]
            wednesdayTimes: string[]
            thursdayTimes: string[]
            fridayTimes: string[]
            saturdayTimes: string[]
            sundayTimes: string[]
            excludedDays: Date[]
            specialDays: {
                times: string[]
                date: Date
            }[]
        }
    }
}

interface argsTimes {
    times: {
        workId: string
        targetDate: Date
    }
}

export const workQuery = {
    getWorkById: async (_parent: any, args: { id: string }) => {
        try {
            return await prisma.work.findUnique({
                where: {
                    id: args.id
                },

                include: {
                    timetable: true,
                    celebrity: {
                        include: {
                            workList: true
                        }
                    }
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    getWorkTimes: async (_parent: any, args: argsTimes) => {
        try {
            const { workId, targetDate } = args.times

            const work = await prisma.work.findUnique({
                where: { id: workId },
                include: {
                    timetable: {
                        include: {
                            specialDays: true
                        }
                    }
                },
            });

            const targetWeekday = targetDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
            const targetDateString = targetDate.toISOString();

            let availableTimeframes: string[] = [];

            const specialDay = work.timetable.specialDays.find((day) =>
                day.date.toISOString() === targetDateString
            );

            if (specialDay) {
                availableTimeframes = specialDay.times;
            } else {
                // it is not a special day, so use the weekday timeframes
                const weekdayTimeframes = work.timetable[targetWeekday + 'Times'];
                availableTimeframes = [...weekdayTimeframes];
            }

            // filter out booked times
            availableTimeframes = availableTimeframes.filter((timeframe) => {
                const timeframeDate = new Date(targetDateString + 'T' + timeframe + 'Z');
                return !work.timetable.bookedTimes.some((bookedTime) =>
                    bookedTime.toISOString() === timeframeDate.toISOString()
                );
            });

            return availableTimeframes
        } catch (err) {
            throw { err }
        }
    }
}

export const workMutation = {
    createWork: async (_parent: any, args: updateWork) => {
        try {
            const { title, type, price, description, duration,
                online, collaboration, celebrityId, timetable } = args.work

            const createdWork = await prisma.work.create({
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

            const createdTimetable = await prisma.timetable.create({
                data: {
                    months: timetable.months,
                    mondayTimes: timetable.mondayTimes,
                    tuesdayTimes: timetable.tuesdayTimes,
                    wednesdayTimes: timetable.wednesdayTimes,
                    thursdayTimes: timetable.thursdayTimes,
                    fridayTimes: timetable.fridayTimes,
                    saturdayTimes: timetable.saturdayTimes,
                    sundayTimes: timetable.sundayTimes,
                    excludedDays: timetable.excludedDays,
                    workId: createdWork.id
                }
            })

            if (timetable.specialDays) {
                for (let i = 0; i < timetable.specialDays.length; i++) {
                    await prisma.specialDay.create({
                        data: {
                            times: timetable.specialDays[i].times,
                            date: timetable.specialDays[i].date,
                            timetableId: createdTimetable.id
                        }
                    })
                }
            }

            return createdWork
        } catch (err) {
            throw { err }
        }
    },

    updateWork: async (_parent: any, args: updateWork) => {
        try {
            const { id, title, type, price, description,
                online, collaboration, duration } = args.work

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