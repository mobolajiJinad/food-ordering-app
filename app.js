const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config({ path: "./config/config.env" });

const userAuthRoutes = require("./routes/auth/user");
const adminAuthRoutes = require("./routes/auth/admin");
const userProtectedRoutes = require("./routes/protected/user");
const adminProtectedRoutes = require("./routes/protected/admin");
const { requireAdmin, requireUser } = require("./middleware/authenticateRoute");
const errorHandler = require("./middleware/errorHandler");
require("./config/passport");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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
app.use("/auth/user", userAuthRoutes);
app.use("/auth/admin", adminAuthRoutes);
app.use("/user", requireUser, userProtectedRoutes);
app.use("/admin", requireAdmin, adminProtectedRoutes);
app.use("/", (req, res) => {
  res.json({ msg: "You are home" });
});

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
