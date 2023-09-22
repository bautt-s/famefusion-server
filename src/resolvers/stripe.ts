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

const stripe = new Stripe(process.env.STRIPE_STORE, { apiVersion: "2023-08-16" })

export const stripeQuery = {
    createCheckoutSession: async (_parent: any, args: { price: string }) => {
        try {
            const { price } = args

            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price,
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: process.env.FRONTEND_URL + '/checkout/success',
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