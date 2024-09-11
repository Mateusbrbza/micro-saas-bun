import { response, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";

export const listUsersController = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.send(users)
}

export const findOneUserController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  })

  if (!user) {
    return res.status(404).send({
      error: 'Not found',
    })
  }

  res.send(user)
}

export const createuserController = async (req: Request, res: Response) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.send({
      error: "name or email is invalid"
    })
  }

  const userEmailAlreadyExists  = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true
    }
  })

  if (userEmailAlreadyExists) {
    return res.status(400).send({
      error: "Email already in use"
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
    }
  })

  res.send(user);
}