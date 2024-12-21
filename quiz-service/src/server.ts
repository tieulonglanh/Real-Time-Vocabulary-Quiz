import express, { Application } from 'express';
import pkg from 'body-parser';
const { json } = pkg;
import quizRoutes from 'routes/quizRoutes';
import errorHandler from 'middlewares/errorHandler';

const app: Application = express();
const port: number = 3000;

app.use(json());
app.use('/api/v1', quizRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});