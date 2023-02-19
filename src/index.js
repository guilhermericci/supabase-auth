import "dotenv/config";
import Fastify from "fastify";
import { userRoutes } from "./routes/userRoutes.js";

const app = Fastify();
app.register(userRoutes);

const port = process.env.PORT || 3333;
await app.listen({ port });
console.log(`🚀 Server is listening on port ${port}`);
