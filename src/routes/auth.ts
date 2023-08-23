import express from "express";
import {signup, login, logout} from '../controllers/user';


/**Routes for signup, login and logout */
const router = express.Router();

// admin and users SIGNUP routes
router.post('/signup-admin', signup);
router.post('/signup', signup);

// admin and users LOGIN route
router.post("/login", login);

// logout user
router.post('/account/logout', logout);

export default router;
