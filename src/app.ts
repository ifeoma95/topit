import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import db from "./config/db.config";
import indexRouter from "./routes/index";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import transactionsRouter from "./routes/transactions";
import userPagesRouter from "./routes/user-pages";
import * as dotenv from "dotenv";
import * as auth from "./middlewares/auth";

// synchronize database
db.sync({ force: false })
  .then(() => {
    console.log("database synced successfully!");
  })
  .catch((error) => {
    console.log("error syncing db", error);
  });

dotenv.config();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

//=======================================================================
// install and use imported routers
// app.use(url, [middlewares], [routers]) => syntax for using middlewares
app.use("/", [indexRouter, authRouter]);
app.use("/account", [auth.authenticate], [usersRouter, userPagesRouter, transactionsRouter]);
//=======================================================================

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(
  (
    err: createError.HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  }
);

export default app;