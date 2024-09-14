import express from 'express';
import {
  createUserController,
  findOneUserController,
  listUsersController,
  updateUserController
} from './controllers/user.controller';
import {
  createTodoController,
  getTodosController,
} from './controllers/todo.controller';
import { createCheckoutController } from './controllers/checkout.controller';

const app = express();
const port = 3000;

app.use(express.json())

// users
app.get('/users', listUsersController)
app.get('/users/:userId', findOneUserController)
app.post('/users', createUserController)
app.put('/users/:userId', updateUserController)
// todos
app.get('/todos', getTodosController)
app.post('/todos', createTodoController)
// checkout
app.post('/checkout', createCheckoutController)

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
