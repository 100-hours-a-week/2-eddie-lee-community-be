import express from 'express';
import * as postModel from '../models/postModel.js';
import * as userModel from '../models/userModel.js';

const dataRouter = express.Router();

//GET
dataRouter.get('/signup/', userModel.isDuplicate);

//POST
dataRouter.post('/auth/signup', userModel.signup);
dataRouter.post('/user', userModel.sendUser);

//DELETE

export default dataRouter;
