import * as express from "express";
import * as emailController from "./controllers/emailController";

export default function server(): any {
  const app: express.Application = express();

  app.get(
    "/api/recommendations/email-image/:index/:recommendationId/:userId",
    emailController.index
  );

  return app;
}
