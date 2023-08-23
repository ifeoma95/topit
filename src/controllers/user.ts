import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../models";
import { FundingAccount, Transaction } from "../models";
import * as utils from "../utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// controllers -> routes -> app.ts

/**POST /signup or /admin/signup */
export async function signup(req: Request, res: Response) {
  console.log('calling controller to sign up new user');
  const isAdmin = req.url === '/signup-admin';
  try {
    if (isAdmin) {
      // try {
      const admin = await User.findAll({ where: { isAdmin } });
      if (admin.length > 0) {
        return res.status(400).json({ message: 'admin already exist!' });
      }
    }

    // validate user input
    const result = utils.registerValidator.validate(req.body, utils.options);
    if (result.error) {
      return res.json({ message: "invalid input" });
    }

    // check if user email already exists in database
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.json({ message: "email already exists!" });
    }

    // hash user password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      id: uuidv4(),
      isAdmin,
    });
    // create funding acct for user
    await FundingAccount.create({
      id: uuidv4(),
      bankName: 'Topidus Bank',
      acctNo: Math.random().toString().slice(2, 12),
      acctName: newUser.dataValues.fullname + ' Topit',
      userId: newUser.dataValues.id,
      acctBal: 0
    });
    // console.log(newUser)
    // return res.status(201).json({ message: "new user created successfully", data: newUser });
    console.log('signup successful. Redirecting to home page for login...')
    return res.redirect('/');
  } catch (error: any) {
    res.render('error', { error, message: error.message });
  }
}

/**POST /login */
export async function login(req: Request, res: Response) {
  console.log('calling controller to login user');
  try {
    const result = utils.loginValidator.validate(req.body, utils.options);
    if (result.error) {
      console.log(result.error.details[0].message);
      return res.status(400).json({ message: "Invalid login details" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: [{ all: true }], });
    if (!user) {
      return res.status(400).json({ message: "Invalid login details" });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, user.dataValues.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid login details" });
    }

    // give user a token after successful login
    const secretKey = process.env.JWT_SECRET as string;
    const expiresIn = 3 * 60 * 60   // in seconds
    const token = jwt.sign({ id: user.dataValues.id, isAdmin: user.dataValues.isAdmin }, secretKey, { expiresIn });
    // save token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: expiresIn * 1000,  // in milliseconds
    })

    // return res.json({message: "Login successful", data: user.dataValues, token});
    res.redirect('/account/dashboard');
  }
  catch (error: any) {
    res.status(500);
    res.render('error', { error, message: error.message });
  }
}

/**PUT /account */
export async function updateAcct(req: Request, res: Response) {
  console.log('calling controller to update user');
  const updates = req.body;
  try {
    const user = await User.findOne({
      where: { id: req.userKey.id },
      attributes: ['id', 'username', 'email', 'fullname', 'phone', 'createdAt']
    });
    if (user) {
      Object.assign(user, { ...user, ...updates });
      await user.save();
      // return res.json({ message: 'updated successfully', data: user.dataValues })
      return res.redirect('profile');
    } else {
      res.json({ message: 'kindly login as a user' })
    }
  }
  catch (error: any) {
    res.status(500);
    res.render('error', { error, message: error.message });
  }
}

/**DELETE /account */
export async function deleteAcct(req: Request, res: Response) {
  console.log('calling controller to delete user');
  if (!req.userKey) {
    return res.json({ message: 'kindly login as a user' });
  }
  try {
    const user = await User.findOne({ where: { id: req.userKey.id } });
    if (user) {
      await FundingAccount.destroy({ where: { userId: user.dataValues.id } });
      await Transaction.destroy({ where: { userId: user.dataValues.id } });
      await user.destroy();
      return res.redirect('/signup');
      // return res.json({ message: "User deleted successfully", data: user.dataValues })
    }
  }
  catch (error: any) {
    res.status(500);
    res.render('error', { error, message: error.message });
  }
}

/**GET /account/all (for admin) */
export async function getAllUsers(req: Request, res: Response) {
  console.log('calling controller to get all users');
  try {
    if (!req.userKey.isAdmin) {
      throw new Error('Unauthorized access!');
    }
    const allUsers = await User.findAll({
      include: [{ all: true }],
      // attributes: ['username', 'email', 'fullname']
    });
    return res.json({ message: 'showing all users', data: allUsers });
  }
  catch (error: any) {
    res.status(500);
    res.render('error', { error, message: error.message });
  }
}

/**POST /account/logout => logout user */
export async function logout(req: Request, res: Response) {
  console.log('calling controller to logout user');
  try {
    res.clearCookie('token');
    res.redirect('/');
  }
  catch (error: any) {
    res.status(500);
    res.render('error', { error, message: error.message });
  }
}