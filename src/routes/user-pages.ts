import express from "express";
import { getUserFundAcct, getUserTransactions } from "../utils";

// routes -> app.ts
// pages router and controllers for user pages (rendered views only)

const router = express.Router();

// GET /account should redirect to /account/dashboard
router.get('/', async function (req, res) {
  res.redirect('dashboard');
});

router.get('/dashboard', async function (req, res) {
  console.log('calling dashboard');
  // render view from views/dashboard.ejs
  const {user, id} = req.userKey;
  const userTransactions = await getUserTransactions(id, 4);
  const userFundAcct = await getUserFundAcct(id);

  const amounts: number[] = []
  const descriptions: string[] = []
  const createdAts: Date[] = [];
  
  userTransactions.forEach((transaction: any) => {
    amounts.push(transaction.amount);
    descriptions.push(transaction.description);
    createdAts.push(transaction.createdAt);
  });

  res.render('dashboard', {
    username: user.username,
    acctBal: userFundAcct?.acctBal,
    amt: amounts,
    desc: descriptions,
    date: createdAts,
  })
});

router.get('/recharge-airtime', function (req, res) {
  // render view from views/recharge.ejs
  const {user} = req.userKey;
  res.render('recharge', {
    username: user.username,
  });
});

/* GET data page. */
router.get('/recharge-data', function (req, res) {
  // render view from views/data.ejs
  const {user} = req.userKey;
  res.render('data', {
    username: user.username
  });
});

/* GET addfunds page. */
router.get('/fund-wallet', function (req, res) {
  // render view from views/addfunds.ejs
  const user = req.userKey.user;
  res.render('addfunds', user);
});

/* GET profile page. */
router.get('/profile', async function (req, res) {
  // render view from views/profile.ejs
  const {user, id} = req.userKey;
  console.log(user);
  const fundingAcct = await getUserFundAcct(id);
  res.render('profile', {
    username: user.username,
    email: user.email,
    phone: user.phone,
    fullname: user.fullname,
    fundingAcct: fundingAcct?.acctNo + ' ' + "Topidus Bank",
  });
});

/* GET update profile page. */
router.get('/profile-update', function (req, res) {
  // render view from views/update-profile.ejs
  const {user} = req.userKey;
  res.render('update-profile', user);
});

/* GET all-transactions page. */
router.get('/transactions', async function (req, res) {
  // render view from views/transactions.ejs
  console.log('calling controller to get all transactions (last 4)');
  const {user, id} = req.userKey;
  const userTransactions = await getUserTransactions(id, 4);
  const userFundAcct = await getUserFundAcct(id);

  const amounts: number[] = []
  const descriptions: string[] = []
  const createdAts: Date[] = [];
  
  userTransactions.forEach((transaction: any) => {
    amounts.push(transaction.amount);
    descriptions.push(transaction.description);
    createdAts.push(transaction.createdAt);
  });

  res.render('transactions', {
    username: user.username,
    acctBal: userFundAcct?.acctBal,
    amt: amounts,
    desc: descriptions,
    date: createdAts,
  })
});

router.get('/withdraw', function (req, res) {
  // render view from views/withdraw.ejs
  const {user} = req.userKey;
  console.log(user);
  res.render('withdraw', user);
});

router.get('/success', function(req, res){
  console.log('calling success page...')
  const {user} = req.userKey;
  const backbtn = req.headers.referer;
  res.render('success', {
    username: user.username,
    back: backbtn
  });
})

// import router into app.ts
export default router;
