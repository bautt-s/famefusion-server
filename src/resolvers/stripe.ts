import Stripe from 'stripe'

interface createProduct {
    product: {
        productId?: string
        name: string
        description: string
        images: string[]
        unit_amount: number
    }
}

interface checkoutArgs {
    checkout: {
        id: string,
        workId: string,
        price: string,
        date: string,
        title: string,
        cel: string,
        location: string,
        totalPrice: number,
        email: string
    }
}

const STRIPE_STORE = process.env.STRIPE_STORE
const stripe = new Stripe(STRIPE_STORE, { apiVersion: "2023-08-16" })

export const stripeQuery = {
    createCheckoutSession: async (_parent: any, args: checkoutArgs) => {
        try {
            const { id, workId, price, date, title, cel, location, totalPrice, email } = args.checkout

            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price,
                        quantity: 1
                    }
                ],
                metadata: {
                    price: totalPrice,
                    id,
                    workId,
                    date,
                    title,
                    cel,
                    location,
                    email
                },
                mode: 'payment',
                success_url: process.env.FRONTEND_URL + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url: process.env.FRONTEND_URL + '/checkout/cancel',
            })

            return JSON.stringify({
                url: session.url
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    retrieveCheckout: async (_parent: any, args: { sessionId: string }) => {
        try {
            const { sessionId } = args

            const session = await stripe.checkout.sessions.retrieve(sessionId)
            
            return JSON.stringify({
                ...session.metadata,
                created: session.created
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    }, 

    getProductById: async (_parent: any, args: { productId: string }) => {
        try {
            const { productId } = args
            const product = await stripe.products.retrieve(productId)

            return product
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

export const stripeMutation = {
    createStripeProduct: async (_parent: any, args: createProduct) => {
        try {
            const { name, description, images, unit_amount } = args.product

            const product = await stripe.products.create({
                name,
                description,
                images,
                type: 'service'
            })

            const price = await stripe.prices.create({
                currency: 'eur',
                product: product.id,
                unit_amount, // price in cents
            })

            return {
                msg: `Created "${product.name}"!`,
                product,
                price,
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    updateStripeProduct: async (_parent: any, args: createProduct) => {
        try {
            const { productId, name, description, images } = args.product

            const updatedProduct = await stripe.products.update(
                productId,
                {
                    name: name || undefined,
                    description: description || undefined,
                    images: images.length ? images : undefined
                }
            )

            return updatedProduct
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    updateStripePrice: async (_parent: any, args: { price: { priceId: string, unit_amount: number } }) => {
        try {
            const { priceId, unit_amount } = args.price

            await stripe.prices.update(priceId, { metadata: { unit_amount } })

            return `Price updated successfully.`
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    activateStripeProduct: async (_parent: any, args: { enable: { productId: string, active: boolean } }) => {
        try {
            const { productId, active } = args.enable

            await stripe.products.update(productId, { active })

            return `Price ${active ? 'enabled' : 'disabled'} successfully.`
        } catch (err) {
            console.log(err)
            throw err
        }
    },
}