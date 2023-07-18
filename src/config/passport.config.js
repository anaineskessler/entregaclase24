import passport from "passport";
import local from "passport-local";
import passport_jwt, { ExtractJwt } from "passport-jwt";
import userModel from "../DAO/model/user.model.js";
import {
  createHash,
  isValidPassword,
  generateToken,
  extractCookie,
  JWT_COOKIE_NAME,
  JWT_SECRET_KEY,
} from "../utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;
const JWTStrategy = passport_jwt.Strategy;
const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.a971844320be6cfa",
        clientSecret: "67c9555c851b0130d1912d16cdcff5ab012484d0",
        callbackURL: "http://localhost:8080/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (user) return done(null, user);
          const newUser = await userModel.create({
            first_name: profile._json.name,
            email: profile._json.email
              ? profile._json.email
              : profile._json.login,
          });
          return done(null, newUser);
        } catch (err) {
          return done("Error to login with github" + err);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error en passport REGISTER " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("User does not exists");
            return done(null, user);
          }

          if (!isValidPassword(user, password)) return done(null, false);

          const token = generateToken(user);
          user.token = token;

          return done(null, user);
        } catch (error) {
          done("error");
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_SECRET_KEY,
      },
      async (jwt_payload, done) => {
        done(null, jwt_payload);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
