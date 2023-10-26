import { prisma } from "../../prisma/db.js";
import cloudinary from "../cloudinary.js";

interface filterArgs {
    filter: {
        location?: string
        price?: {
            range: boolean,
            min: number,
            max: number,
        }
        availability?: {
            startDate: Date,
            endDate: Date
        }
        ageGroup?: [number, number]
        gender?: string[],
        languages?: string[],
        interests?: string[],
        opportunities?: string[],
        name?: string,
        category?: string
    }
}

interface createArgs {
    celebrity: {
        id?: string,
        name?: string,
        email?: string,
        location?: string,
        nickname?: string,
        biography?: string,
        description?: string,
        associatedBrands?: string[],
        categories?: string[],
        birthYear?: Date,
        gender?: string,
        languages?: string[],
        interests?: string[],
        media?: string[],
        rating?: number,
        userId?: string
        locationVerified?: boolean,
        identityVerified?: boolean,
        selfieVerified?: boolean,
        selfieImg?: string,
        locationImg?: string,
        identityImg?: string,
        websiteLink?: string,
        instagramLink?: string,
        tiktokLink?: string,
        facebookLink?: string,
        twitterLink?: string,
        youtubeLink?: string,
    }
}

interface createDay {
    day: {
        date?: Date,
        celebrityId?: string
    }
}

function formatDateTime(date: Date) {
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const weekDay = date.toLocaleString('en-US', { weekday: 'long' });

    // Get the hour and minutes in 24-hour format (HH:mm)
    const hourAndMinute = date.toLocaleString('en-US', {
        hour12: false, // 24-hour format
        hour: '2-digit',
        minute: '2-digit',
    });

    // Get the date in the format DD-MM-YYYY
    const formattedDate = date.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return {
        weekDay,
        hour: hourAndMinute,
        date: formattedDate,
    };
}


function getAvailabilityData(availabilityObject: any, reservations: any) {
    // Create an array to store the results for 182 days
    const result = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set the time to midnight

    for (let i = 0; i < 182; i++) {
        const currentDate = new Date(now);
        currentDate.setDate(currentDate.getDate() + i);

        const currentWeekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
            currentDate.getDay()
        ];

        // Check if the current date is in the excludedDays array
        const isExcluded = availabilityObject.excludedDays.some((excludedDate) =>
            excludedDate.getTime() === currentDate.getTime()
        );

        if (!isExcluded) {
            // Initialize availability as false
            let isAvailable = false;

            // Check if there are specialDays for the current date
            const specialDay = availabilityObject.specialDays.find((special) =>
                special.date === currentDate.toLocaleDateString("en-US")
            );

            if (specialDay) {
                // Use the timeframes from the special day
                isAvailable = specialDay.timeframes.length > 0;
            } else {
                // Use the timeframes for the regular weekday if it exists
                const weekdayAttribute = currentWeekday.toLowerCase() + "Times";
                if (availabilityObject[weekdayAttribute] && availabilityObject[weekdayAttribute].length > 0) {
                    isAvailable = true;
                }
            }

            // Count the reservations for the current date
            const reservationCount = reservations.filter(
                (reservation) =>
                    reservation.weekDay === currentWeekday &&
                    reservation.date === currentDate.toLocaleDateString("en-US")
            ).length;

            // Add the data for the current day to the result array
            result.push({
                date: currentDate.toLocaleDateString("en-US"),
                weekDay: currentWeekday,
                reservationCount,
                isAvailable,
            });
        }
    }

    return result;
}



export const celebrityQuery = {
    getAllCelebrities: async (_parent: any, args?: { name?: string }) => {
        try {
            const celebrities = await prisma.celebrity.findMany({
                where: {
                    name: {
                        contains: args.name || '',
                        mode: 'insensitive'
                    }
                },

                orderBy: {
                    name: "asc"
                },

                include: {
                    workList: {
                        orderBy: {
                            price: 'asc'
                        }
                    },
                    associatedUser: true,
                    reviewList: true,
                }
            })

            if (celebrities.length) return celebrities
            else 'Could not find any celebrities.'
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    getCelebrityById: async (_parent: any, args: { id: string }) => {
        try {
            const celebrity = await prisma.celebrity.findUnique({
                where: {
                    id: args.id
                },

                include: {
                    workList: {
                        orderBy: {
                            price: 'asc'
                        }
                    },
                    associatedUser: true,
                    reviewList: true,
                }
            })

            return celebrity ?? 'Could not find celebrity.'
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    getFilteredCelebrities: async (_parent: any, args: filterArgs) => {
        try {
            const celebrities = await prisma.celebrity.findMany({
                where: {
                    languages: args.filter.languages.length ? {
                        hasSome: args.filter.languages
                    } : undefined,

                    interests: args.filter.interests.length ? {
                        hasSome: args.filter.interests
                    } : undefined,

                    gender: args.filter.gender.length ? {
                        in: args.filter.gender
                    } : undefined,

                    workList: args.filter.opportunities.length || args.filter.price.range ? {
                        some: {
                            type: args.filter.opportunities.length ? {
                                in: args.filter.opportunities
                            } : undefined,

                            price: args.filter.price.range ? {
                                gte: args.filter.price.min,
                                lte: args.filter.price.max
                            } : undefined
                        }
                    } : undefined,

                    location: args.filter.location || undefined,

                    categories: args.filter.category.length ? {
                        has: args.filter.category
                    } : undefined,

                    name: {
                        contains: args.filter.name.length ? args.filter.name : '',
                        mode: 'insensitive'
                    }
                },

                orderBy: {
                    name: "asc"
                },

                include: {
                    workList: {
                        orderBy: {
                            price: 'asc'
                        }
                    },
                    associatedUser: true,
                    reviewList: true,
                }
            })

            if (celebrities.length) return celebrities
            else 'Could not find any celebrities.'
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    getCalendarView: async (_parent: any, args: { id: string }) => {
        try {
            const timetables = await prisma.timetable.findMany({
                where: { work: { celebrityId: args.id } },
                select: {
                    mondayTimes: true,
                    tuesdayTimes: true,
                    wednesdayTimes: true,
                    thursdayTimes: true,
                    fridayTimes: true,
                    saturdayTimes: true,
                    sundayTimes: true,
                    excludedDays: true,
                    specialDays: true,
                },
            })

            const reservations = await prisma.reservation.findMany({
                where: {
                    work: {
                        celebrityId: args.id
                    }
                },
                select: {
                    reservationTime: true
                }
            });

            const reservedTimes = reservations.map(r => formatDateTime(r.reservationTime))
            const availabilityData = getAvailabilityData(timetables, reservedTimes)
            
            return JSON.stringify(availabilityData)
        } catch (err) {
            console.log(err)
            throw { err }
        }
    }
}

export const celebrityMutation = {
    createCelebrity: async (_parent: any, args: createArgs, context: any) => {
        try {
            //if (!context.user) throw 'USER_NOT_AUTHENTICATED'

            const {
                name,
                email,
                location,
                nickname,
                biography,
                description,
                associatedBrands,
                categories,
                birthYear,
                gender,
                languages,
                interests,
                media,
                rating,
                userId,
                selfieImg,
                locationImg,
                identityImg,
                websiteLink,
                tiktokLink,
                facebookLink,
                twitterLink,
                instagramLink,
                youtubeLink
            } = args.celebrity;

            // upload media array images to cloudinary
            const mediaCloudinary = <string[]>[];

            media.map(async (image) => {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'celebritiesImgs',
                    resource_type: 'auto',
                })

                mediaCloudinary.push(result.url)
            })

            // upload verification files to cloudinary
            const identityCloudinary = selfieImg ? await cloudinary.uploader.upload(selfieImg, {
                folder: 'celebrityIdentities',
            }) : undefined

            const selfieCloudinary = identityImg ? await cloudinary.uploader.upload(identityImg, {
                folder: 'celebritySelfies',
            }) : undefined

            const locationCloudinary = locationImg ? await cloudinary.uploader.upload(locationImg, {
                folder: 'celebrityLocations',
            }) : undefined

            return await prisma.celebrity.create({
                data: {
                    name,
                    email,
                    location,
                    nickname,
                    biography,
                    description,
                    associatedBrands,
                    categories,
                    birthYear,
                    gender,
                    languages,
                    interests,
                    media: mediaCloudinary,
                    rating,
                    userId,
                    locationImg: locationCloudinary?.url,
                    selfieImg: selfieCloudinary?.url,
                    identityImg: identityCloudinary?.url,
                    websiteLink,
                    tiktokLink,
                    youtubeLink,
                    instagramLink,
                    facebookLink,
                    twitterLink
                }
            })
        } catch (err) {
            console.log(err)
            throw { err }
        }
    },

    updateCelebrity: async (_parent: any, args: createArgs) => {
        try {
            const {
                id,
                name,
                email,
                location,
                nickname,
                biography,
                description,
                associatedBrands,
                categories,
                birthYear,
                gender,
                languages,
                interests,
                media,
                rating,
                userId,
                locationVerified,
                identityVerified,
                selfieVerified,
                selfieImg,
                locationImg,
                identityImg,
                websiteLink,
                tiktokLink,
                youtubeLink,
                instagramLink,
                facebookLink,
                twitterLink
            } = args.celebrity;

            // upload verification files to cloudinary
            const identityCloudinary = identityImg ? await cloudinary.uploader.upload(selfieImg, {
                folder: 'celebrityIdentities',
            }) : undefined

            const selfieCloudinary = selfieImg ? await cloudinary.uploader.upload(identityImg, {
                folder: 'celebritySelfies',
            }) : undefined

            const locationCloudinary = locationImg ? await cloudinary.uploader.upload(locationImg, {
                folder: 'celebrityLocations',
            }) : undefined

            return await prisma.celebrity.update({
                where: { id },

                data: {
                    name: name || undefined,
                    email: email || undefined,
                    location: location || undefined,
                    nickname: nickname || undefined,
                    biography: biography || undefined,
                    description: description || undefined,
                    associatedBrands: associatedBrands || undefined,
                    categories: categories || undefined,
                    birthYear: birthYear || undefined,
                    gender: gender || undefined,
                    languages: languages || undefined,
                    interests: interests || undefined,
                    media: media || undefined,
                    rating: rating || undefined,
                    userId: userId || undefined,
                    locationVerified: locationVerified || undefined,
                    identityVerified: identityVerified || undefined,
                    selfieVerified: selfieVerified || undefined,
                    locationImg: locationCloudinary?.url,
                    selfieImg: selfieCloudinary?.url,
                    identityImg: identityCloudinary?.url,
                    websiteLink: websiteLink || undefined,
                    tiktokLink: tiktokLink || undefined,
                    youtubeLink: youtubeLink || undefined,
                    instagramLink: instagramLink || undefined,
                    facebookLink: facebookLink || undefined,
                    twitterLink: twitterLink || undefined,
                }
            })
        } catch (err) {
            throw { err }
        }
    },

    deleteCelebrity: (_parent: any, args: { id: string }) => {
        try {
            const { id } = args

            return prisma.celebrity.delete({
                where: { id }
            })
        } catch (err) {
            throw { err }
        }
    }
}