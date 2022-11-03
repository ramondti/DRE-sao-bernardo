import "dotenv/config";
import express from "express";
import cron from "node-cron";
import { FindDreService } from "./services/FindDreService";
const app = express();

app.use(express.json({ limit: "1000mb" }));

cron.schedule("*/10 * * * *", async () => {
  console.log(" ### Executando a tarefa a cada 10 minuto");
  const service = new FindDreService();
  await service.execute();
});

// app.get("/dre", async (req, res) => {
//   const findDreService = new FindDreService();
//   return res.json(await findDreService.execute());
// });

app.listen(9292, (err, data) => {
  console.log(" ### Ouvindo na porta 9292");
});

export default app;
