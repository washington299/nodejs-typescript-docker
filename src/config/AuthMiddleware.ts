import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import Token from '../models/Token';

class Jwt {
  public generateToken = (payload: object): string => {
    const token = jwt.sign(payload, process.env.SECRETKEY, { algorithm: 'HS256' });

    return token;
  }

  public validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    let token: string;

    if (req.query.token) {
      token = req.query.token;
    }
    if (req.body.token) {
      token = req.body.token;
    }

    const logged = await this.isLogged(token);
    if (!logged) {
      return res.json({ error: 'Invalid token!!' });
    }

    next();
  }

  public decodeToken = (token: string): { id: string } => {
    const userData = jwt.decode(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id }: any = userData;

    return { id };
  }

  public isLogged = async (token: string): Promise<boolean> => {
    const logged = await Token.findOne({ token });
    if (!logged) {
      return false;
    }

    return true;
  }
}

export default new Jwt();
