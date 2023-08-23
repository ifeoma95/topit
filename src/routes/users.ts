import express from 'express';
import * as controller from '../controllers/user';

// routes -> app.ts
// router and controllers for user accounts

// create router for /account
const router = express.Router();

router.put("/profile",  controller.updateAcct);
router.delete("/", controller.deleteAcct);

// admin GET all users => return all users in json format
router.get('/all-users', controller.getAllUsers);

// import router into app.ts
export default router;
