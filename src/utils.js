import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JWT_SECRET_KEY = "secret";
const JWT_COOKIE_NAME = "codercookie";

const generateToken = (user) => {
  const token = jwt.sign({ user }, JWT_SECRET_KEY, { expiresIn: "24h" });
  return token;
};

const extractCookie = (req) => {
  return req && req.cookies ? req.cookies[JWT_COOKIE_NAME] : null;
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).render("errors/base", {
          error: info.message ? info.message : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export {
  __dirname,
  createHash,
  isValidPassword,
  generateToken,
  extractCookie,
  JWT_SECRET_KEY,
  JWT_COOKIE_NAME,
  passportCall,
};
