import Stripe from "stripe";
import { config } from "../config";

export const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: '2024-06-20',
})

export const generateCheckout = () => {
  stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID,
      quantity: 1
    }],
    mode: 'subscription',
    
  })
}


export const handleProcessWebhokCheckout = () => {}
export const handleProcessWebhokSubscription = () => {}