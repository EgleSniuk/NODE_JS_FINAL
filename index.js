import express from "express";
import mongoose from "mongoose";

import "dotenv/config";

import userRouter from "./src/router/user.js";
import ticketRouter from "./src/router/ticket.js";

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));


// Vartotojų registracija ir valdymas
app.use("/users", userRouter);

// Bilietų kūrimas ir peržiūra
app.use("/tickets", ticketRouter);


app.use((req, res) => {
  res.status(404).json({ message: "This endpoint does not exist" });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});