import express from 'express';
import {
  createUserController,
  deleteUserController,
  findOneUserController,
  listUsersController,
  updateUserController
} from './controllers/user.controller';
import {
  createTodoController,
  getTodosController,
} from './controllers/todo.controller';
import { createCheckoutController } from './controllers/checkout.controller';
import { stripeWebhookController } from './controllers/stripe.controller';

const app = express();
const port = 3000;

app.post(
  '/stripe',
  express.raw({ type: 'application/json'}),
  stripeWebhookController
);

app.use(express.json())

// users
app.get('/users', listUsersController)
app.get('/users/:userId', findOneUserController)
app.post('/users', createUserController)
app.put('/users/:userId', updateUserController)
app.delete('/users/:userId', deleteUserController)
app.get('/todos', getTodosController)
app.post('/todos', createTodoController)
app.post(
  '/checkout',
  createCheckoutController
)

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
