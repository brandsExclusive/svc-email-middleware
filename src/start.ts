require("dotenv-safe").config({
  path: ".env"
});

import server from "./server";

const port = process.env.PORT || 8080;
const appEnv = process.env.APP_ENV || "developement";

server().listen(port, () => {
  console.log(`Starting ${appEnv} server on port ${port}`);
});
