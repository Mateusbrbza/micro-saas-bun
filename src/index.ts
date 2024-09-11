import express from 'express';
import { createuserController, findOneUserController, listUsersController } from './controllers/user.controller';
import { createTodoController } from './controllers/todo.controller';

const app = express();
const port = 3000;

app.use(express.json())
// users
app.get('/users', listUsersController)
app.get('/users/:userId', findOneUserController)
app.post('/users', createuserController)
// todos
app.post('/todos', createTodoController)

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})