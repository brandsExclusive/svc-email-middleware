const appEnv = process.env.APP_ENV || "developement";

if (appEnv !== "production") {
  require("dotenv-safe").config({
    path: ".env"
  });
}

import server from "./server";

const port = process.env.PORT || 8080;

const app = server().listen(port, () => {
  console.log(`Starting ${appEnv} server on port ${port}`);
});

module.exports = app;
