// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
//require("./db");
const sequelize = require("./config/database");

// Load Sequelize models so they are registered with the `sequelize` instance.
// We prefer the new Sequelize model files (suffix `.model.new.js`).
require("./models/Artist.model.new");
require("./models/Event.model.new");
require("./models/User.model.new");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ✅ Sync DB before starting the server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // This creates or updates tables to match your models
    await sequelize.sync({ alter: true }); // change to { force: true } only if you want to drop & recreate
    console.log("✅ Models synced with database");

    // Now mount your routes
    app.use("/artists", require("./routes/artists.routes"));

    const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start:", error);
    process.exit(1);
  }
})();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/profile", profileRoutes);

const artistsRoutes = require("./routes/artists.routes");
app.use("/artists", artistsRoutes);

const eventsRoutes = require("./routes/events.routes");
app.use("/events", eventsRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
