import { type Request, type Response } from "express";
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

export const createUserController = async (req: Request, res: Response) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).send({
      error: "Name and email are required"
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

  res.status(201).send(user);
}

export const updateUserController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).send({
      error: 'At least one field (name or email) must be provided for update',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).send({
      error: 'User not found',
    });
  }

  if (email && email !== user.email) {
    const userEmailAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (userEmailAlreadyExists) {
      return res.status(400).send({
        error: 'Email already in use',
      });
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: name || undefined,
      email: email || undefined,
    },
  });

  res.send(updatedUser);
};
