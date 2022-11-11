import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { validate, userModel } from '../models/user'

const usersRouter = express.Router();

usersRouter.post('/', async (req: express.Request, res: express.Response) => {
    console.log(req.header('x-auth-token'))
});

export default usersRouter;