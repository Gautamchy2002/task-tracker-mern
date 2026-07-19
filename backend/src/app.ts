import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";
import { prisma } from "./lib/prisma.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import { ZodError } from "zod";
import { AppError } from "./utils/AppError.js";
const app = express();

/*
 * Helmet application me security-related HTTP headers add karta hai.
 */
app.use(helmet());

/*
 * CORS frontend ko backend APIs call karne ki permission deta hai.
 * Development me frontend localhost:5173 par chalega.
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/*
 * JSON request body ko JavaScript object me convert karta hai.
 */
app.use(express.json());

/*
 * Form URL-encoded data ko read karne ke liye.
 */
app.use(express.urlencoded({ extended: true }));

/*
 * Har incoming API request ka log terminal me show karega.
 */
app.use(morgan("dev"));

/*
 * Health-check API.
 * Isse verify hoga ki backend server properly run ho raha hai.
 */
app.get("/api/health", (_request: Request, response: Response) => {
  response.status(200).json({
    success: true,
    message: "Task Tracker API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/database-health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    next(error);
  }
});
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
/*
 * Agar requested route application me exist nahi karta.
 */
app.use((_request: Request, response: Response) => {
  response.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/*
 * Global error-handling middleware.
 * Spring Boot ke @ControllerAdvice jaisa kaam karega.
 */
// app.use(
//   (
//     error: Error,
//     _request: Request,
//     response: Response,
//     _next: NextFunction,
//   ) => {
//     console.error("Unhandled application error:", error);

//     response.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   },
// );

app.use(
  (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    console.error(error);

    if (error instanceof ZodError) {
      return response.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  },
);
export default app;
