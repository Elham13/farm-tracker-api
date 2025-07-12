import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { authRegistry } from "@/api/auth/authRegistry";
import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRegistry";
import { env } from "@/common/utils/envConfig";
import { farmRegistry } from "@/api/farm/farmRegistry";
import { cropRegistry } from "@/api/crop/cropRegistry";
import { operationsMasterRegistry } from "@/api/operations-master/operationsMasterRegistry";

export type OpenAPIDocument = ReturnType<
  OpenApiGeneratorV3["generateDocument"]
>;

export function generateOpenAPIDocument(): OpenAPIDocument {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    authRegistry,
    farmRegistry,
    cropRegistry,
    operationsMasterRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Farm Tracker API",
      description:
        "This is a backend service to provide data for the Farm Tracker Mobile app and Dashboard.",
      contact: {
        name: "Elhamuddin Mahmoodi",
        email: "elhamuddin.mahmoodi@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
