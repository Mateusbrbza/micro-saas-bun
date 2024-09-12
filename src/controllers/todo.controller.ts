import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createTodoController = async (req: Request, res: Response) => {
  const { title } = req.body
  const userId = req.headers['x-user-id']

  if (!userId) {
    return res.status(403).send({
      error: 'Not authorized'
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId as string
    }
  })

  if (!user) {
    return res.status(403).send({
      error: 'Not authorized'
    })
  }

  const todo = await prisma.todo.create({
    data: {
      title,
      ownerId: user.id,
      done: false,
    }
  })

  return res.status(201).send(todo)
}