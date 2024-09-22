import Stripe from "stripe";
import { config } from "../config";
import { prisma } from "./prisma";

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


export const handleProcessWebhokCheckout = async (
  event: { object: Stripe.Checkout.Session }
) => {
  const clientReferenceId = event.object.client_reference_id as string;
  const stripeSubscriptionId = event.object.subscription as string;
  const stripeCustomerId = event.object.customer as string;
  const checkoutStatus = event.object.status as string;

  if (checkoutStatus !== 'complete') return;

  if (!clientReferenceId || !stripeCustomerId || !stripeSubscriptionId) {
    throw new Error('clientReferenceId, stripeSubscriptionId and stripeCustomerId is required')
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: clientReferenceId,
    },
    select: {
      id: true,
    },
  })

  if (!userExists) {
    throw new Error('clientReferenceId not found')
  }

  await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      stripeCustomerId,
      stripeSubscriptionId
    }
  })
}

export const handleProcessWebhokSubscription = async (
  event: { object: Stripe.Subscription }
) => {
  const stripeCustomerId = event.object.customer as string;
  const stripeSubscriptionId = event.object.id as string;
  const stripeSubscriptionStatus = event.object.status;

  const userExists = await prisma.user.findFirst({
    where: {
      id: stripeCustomerId,
    },
    select: {
      id: true,
    },
  })

  if (!userExists) {
    throw new Error('stripeCustomerId not found')
  }

  await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      stripeSubscriptionId,
      stripeCustomerId,
      stripeSubscriptionStatus,
    }
  })
}
