import "@/common/utils/process";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { allRoutes } from "@/api";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import connectDb from "@/common/db";
import { errorHandler, notFoundRouter } from "@/common/middleware/errorHandler";
// import rateLimiter from "@/common/middleware/rateLimiter";
import { env } from "@/common/utils/envConfig";

const app: Express = express();

// Connect to the database
connectDb();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
// app.use(rateLimiter);

// Routes
app.use("/api", allRoutes);

// Swagger UI
app.use(openAPIRouter);

app.use(notFoundRouter);

// Error handlers
app.use(errorHandler);

export { app };
