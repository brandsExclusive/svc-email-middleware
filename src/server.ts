import * as express from "express";
import * as emailController from "./controllers/emailController";
import * as linkController from "./controllers/linkController";
import * as statsController from "./controllers/statsController";
import { authMiddleware } from "./middleware/auth";

export default function server(): any {
  const app: express.Application = express();

  app.get(
    "/api/email-middleware/email-image/:layout(mobile|desktop)/:index/:recommendationId/:userId",
    emailController.index
  );

  app.get(
    "/api/email-middleware/track-link/:index/:recommendationId/:userId",
    linkController.index
  );

  app.get(
    "/api/email-middleware/daily-views",
    authMiddleware,
    statsController.index
  );

  app.get(
    "/api/email-middleware/user-opens/:userId",
    authMiddleware,
    statsController.userOpens
  );

  return app;
}
