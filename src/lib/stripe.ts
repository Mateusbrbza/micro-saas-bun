import Stripe from "stripe";
import { config } from "../config";

export const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: '2024-06-20',
})

export const generateCheckout = async (userId: string) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      client_reference_id: userId,
      success_url: `http://localhost:3000/success.html`,
      cancel_url: `http://localhost:3000/cancel.html`,
      line_items: [{
        price: config.stripe.proPriceId,
        quantity: 1
      }],
    })

    return {
      url: session.url,
    }
  } catch (err) {
    console.error(err)
  }
}


export const handleProcessWebhokCheckout = () => {}
export const handleProcessWebhokSubscription = () => {}
