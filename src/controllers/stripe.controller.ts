import type { Request, Response } from "express";
import { handleProcessWebhokCheckout, handleProcessWebhokSubscription, stripe } from "../lib/stripe";
import { config } from "../config";

export const stripeWebhookController = async (req: Request, res: Response) => {
  let event = req.body

  if (!config.stripe.secretKey) {
    console.error('STRIPE_WEBHOOK_SECRET_KEY is not set')
    return res.sendStatus(400)
  }

  const signature = req.headers['stripe-signature'] as string;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.secretKey
    )
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed`, errorMessage)
    return res.sendStatus(400)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleProcessWebhokCheckout(event);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleProcessWebhokSubscription(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return res.json({received: true})
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : 'Unknown error'
    console.error(errorMessage);
    return res.status(500).json({ error: errorMessage });
  }
}
