import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../models/user';
import { admin } from '../middleware';

const authRouter = express.Router();

authRouter.post('/', async (req: express.Request, res: express.Response) => {
    const user = await UserModel.findOne({ email: req.body.email }); 
    if (!user || !await bcrypt.compare(req.body.password, user.password))
        return res.status(400).send({ message: 'Invalid email or password' });
    // @ts-ignore
    const token = user.generateAuthToken(user);
    return res.status(200).send({data: token, message: 'Signing in...'});
});

export default authRouter;

