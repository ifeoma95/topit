import express from "express";
import * as controller from "../controllers/transaction"

// routes -> app.ts
// router and controllers for user transactions

const router = express.Router();

// url => /account
router.post('/recharge-airtime', controller.recharge);
router.post('/recharge-data', controller.recharge);
router.post('/fund-wallet', controller.fund);

// import router into app.ts
export default router;


