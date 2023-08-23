import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import jwt from "jsonwebtoken";

/**
 * Middleware function to authenticate user by verifying token.
 * If token is valid, sets the `req.user` property to the decoded user object.
 * If token is invalid or not found, redirects to the homepage or renders an error page.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  console.log('calling authenticate middleware');
  const secretKey = process.env.JWT_SECRET as string;
  const token = req.cookies.token;

  if (!token) {
    console.log('No token found. Please sign up or login if you already have an account');
    return res.redirect('/');
  } else {
    try {
      const decodedToken = jwt.verify(token, secretKey);
      req.userKey = decodedToken;
      const { id } = req.userKey;    
      const userModel = await getUserById(id);
      req.userKey.user = userModel?.dataValues;
      next();
    } catch (error: any) {
      res.render('error', { error, message: error.message });
    }
  }
}

/**
 * Middleware function to verify the authorization of a user.
 * It checks if the user exists in the database based on the user ID provided in the request token.
 * If the user is found, it sets the `req.user` property to the user object and proceeds to the next middleware.
 * If the user is not found, it returns a 401 Unauthorized response.
 * @param req The request object.
 * @param res The response object.
 * @param next The next middleware function.
 */
export async function authorization(req: Request, res: Response, next: NextFunction) {
  // console.log('Calling authorization middleware');
  // try {
  //   const { id } = req.userKey;
  //   const user = await User.findOne({
  //     where: { id },
  //     // include: [{ all: true }]
  //   });

  //   if (!user) {
  //     return res.status(401).send('Unauthorized');
  //   }

  //   const userModel = await getUserById(id);
  //   req.userKey.user = userModel?.dataValues;
  //   next();
  // } catch (error: any) {
  //   res.render('error', { error, message: error.message });
  // }
}


declare global {
  namespace Express {
    interface Request {
      userKey?: any;
    }
  }
}

export async function getUserById(id: string) {
  const data = await User.findOne({
    where: { id: id },
    attributes: ['id', 'username', 'email', 'fullname', 'phone'],
    // include: [{ model: FundingAccount, attributes: ['acctNo', 'acctBal'] }]
  });
  return data;
}