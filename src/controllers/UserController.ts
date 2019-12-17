import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import jwt from '../config/AuthMiddleware';
import User from '../models/User';
import Token from '../models/Token';

interface Iuser {
  id: string,
}

interface Ifile {
  filename: string,
}

class UserController {
  public index = async (_req: Request, res: Response): Promise<Response> => {
    const users = await User.find();

    return res.json(users);
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    let token: string;

    if (req.query.token) {
      token = req.query.token;
    }
    if (req.body.token) {
      token = req.body.token;
    }

    const userData: Iuser = jwt.decodeToken(token);
    const user = await User.findOne({ _id: userData.id });

    return res.json(user);
  }

  public signup = async (req: Request, res: Response): Promise<Response> => {
    const {
      name,
      email,
      password,
      confirmedPassword,
    } = req.body;

    // Checking the credentials
    if (!name || !email || !password || !confirmedPassword) {
      return res.json({ error: 'All fields must have values!!' });
    }

    if (password !== confirmedPassword) {
      return res.json({ error: 'Your passwords does not match!!' });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({ error: 'This user already exists!!' });
    }

    // encrypting the password and generating the token
    const newPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: newPassword });

    const payload = {
      id: user._id,
    };

    const token = jwt.generateToken(payload);
    await Token.create({ token });

    return res.json({ token });
  }

  public signin = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ error: 'All fields must have values!!' });
    }

    const user = await User.findOne({ email }).select('password');
    if (!user) {
      return res.json({ error: 'Invalid e-mail!!' });
    }

    const rightPassword = await bcrypt.compare(password, user.password);
    if (!rightPassword) {
      return res.json({ error: 'Wrong password!!' });
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.generateToken(payload);
    await Token.create({ token });

    return res.json({ token });
  }

  public update = async (req: Request, res: Response): Promise<Response> => {
    const {
      name,
      email,
      password,
      confirmedPassword,
    } = req.body;

    const { filename }: Ifile = req.file;

    if (!name || !email) {
      return res.json({ error: 'Name and e-mail are required!!' });
    }

    if (password !== confirmedPassword) {
      return res.json({ error: 'Your passwords does not match!!' });
    }

    const newPassword = await bcrypt.hash(password, 10);
    // getting the user's password.
    const currently = await User.findOne({ email }).select('password');

    const user = await User.findOneAndUpdate({ email }, {
      thumbnail: filename,
      name,
      password: confirmedPassword ? newPassword : currently.password,
    });

    return res.json(user);
  }

  public signout = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.query;

    await Token.findOneAndDelete({ token });
    return res.json({ success: 'Log out successful' });
  };
}

export default new UserController();
