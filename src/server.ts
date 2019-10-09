import * as express from "express";
import * as emailController from "./controllers/emailController";
import * as linkController from "./controllers/linkController";

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

  return app;
}
