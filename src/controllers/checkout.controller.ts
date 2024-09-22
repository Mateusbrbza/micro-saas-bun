import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateCheckout } from "../lib/stripe";

export const createCheckoutController = async (
  request: Request,
  response: Response
) => {
  const userId = request.headers['x-user-id'];

  if (!userId) {
    return response.status(403).send({
      error: 'Not authorized'
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
    }
  })

  if (!user) {
    return response.status(403).send({
      error: 'Not authorized',
    })
  }

  const checkout = await generateCheckout(user.id, user.email)

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripeCustomerId: checkout?.stripeCustomerId
    }
  })

  return response.send(checkout);
}
