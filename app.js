const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config({ path: "./config/config.env" });

const authRoutes = require("./routes/auth");
const loggedInRoutes = require("./routes/loggedIn");
const requireAuth = require("./middleware/authenticateRoute");
const errorHandler = require("./middleware/errorHandler");
require("./config/passport");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Seven days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Define routes and other middleware
app.use("/auth", authRoutes);
app.use("/", requireAuth, loggedInRoutes);

// Add error handling middleware to the app
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully");

    // Start listening on the port after the database connection is established
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
