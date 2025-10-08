import express from "express";
import ticketsRouter from "./routes/tickets";
import authRouter from "./routes/auth";
import colaboradoresRouter from "./routes/colaboradores";

const app = express();
app.use(express.json());

// rotas
app.use("/tickets", ticketsRouter);
app.use("/auth", authRouter);
app.use("/colaboradores", colaboradoresRouter);

// healthcheck
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`);
  });
}

export default app;
