import "dotenv/config";
import serverless from "serverless-http";
import { app } from "../../server/app";
import { registerApiRoutes } from "../../server/routes";

registerApiRoutes(app);

export const handler = serverless(app);
