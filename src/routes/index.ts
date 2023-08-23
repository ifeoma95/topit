import express from 'express';

// routes -> app.ts
// router and controllers for home pages (rendered views only)

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  // render view from views/index.ejs
  res.render('index');
});

/* GET signup page. */
router.get('/signup', function (req, res) {
  // render view from views/signup.ejs
  res.render('signup');
});

router.get('admin/signup', function (req, res) {
  // render view from views/signup.ejs
  res.render('signup');
});

/* GET contact page. */
router.get('/contact', function (req, res) {
  // render view from views/contact.ejs
  res.render('contact');
});

// import router into app.ts
export default router;
