import * as express from "express";
import * as emailController from "./controllers/emailController";
import * as linkController from "./controllers/linkController";
import * as statsController from "./controllers/statsController";

export default function server(): any {
  const app: express.Application = express();

  app.get(
    "/api/recommendations/email-image/:layout(mobile|desktop)/:index/:recommendationId/:userId",
    emailController.index
  );

  app.get(
    "/api/recommendations/track-link/:index/:recommendationId/:userId",
    linkController.index
  );

  app.get("/api/recommendations/daily-views", statsController.index);

  app.get("/api/recommendations/user-opens/:userId", statsController.userOpens);

  return app;
}
