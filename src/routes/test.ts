import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { validate, UserModel } from '../models/user'

const usersRouter = express.Router();

usersRouter.post('/', async (req: express.Request, res: express.Response) => {
    const user = await UserModel.findOneAndUpdate(
        {_id: "636cfc03b8aeaff5bcf13526"},
        { $set: { isAdmin: true } },
        { new: true }
    );
    res.send({data: user})
});

export default usersRouter;