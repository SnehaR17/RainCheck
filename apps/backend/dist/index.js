import express from "express";
import cors from "cors";
// import type { ApiResponse, SimulationInput, SimulationResult } from "@raincheck/types";
const app = express();
app.use(cors());
app.use(express.json());
// app.get("/api/health", (_req, res) => {
//   const response: ApiResponse<string> = { success: true, data: "Backend is running 🚀" };
//   res.json(response);
// });
// app.post("/api/simulate", (req, res) => {
//   const body = req.body as SimulationInput;
//   const result: SimulationResult = {
//     feasibilityScore: 90,
//     message: `Feasibility calculated for ${body.city} with ${body.members} members`
//   };
//   const response: ApiResponse<SimulationResult> = { success: true, data: result };
//   res.json(response);
// });
const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
