import createError from "http-errors";
import express from "express";
import path from "path";
import logger from "morgan";
import handlebars from "hbs";
import cookieParser from "cookie-parser";

import {times, ifeq} from "./handlebars-helper/handlebars-helper.js";
import indexRouter from "./controller/routeController.js"

const app = express();

app.set("views", path.join(path.resolve(), "views"));
app.set("view engine", "hbs");
handlebars.registerHelper("times",times);
handlebars.registerHelper("ifeq",ifeq);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("public")));
app.use(cookieParser());

app.use("/", indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

export default app;
