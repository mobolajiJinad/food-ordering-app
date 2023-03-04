const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Configure the Google authentication strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Create a new user if they don't exist
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Configure the local authentication strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "usernameOrEmail",
      passwordField: "password",
    },
    async (usernameOrEmail, password, done) => {
      try {
        let searchProperty;
        let query = {};

        if (usernameOrEmail.includes(".com") && usernameOrEmail.length > 7) {
          searchProperty = "email";
        } else {
          searchProperty = "username";
        }

        query[searchProperty] = usernameOrEmail;

        // Find the user by email or username
        const user = await User.findOne(query);

        if (!user) {
          return done(null, false);
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, {
            msg: `Incorrect ${searchProperty} or password.`,
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
