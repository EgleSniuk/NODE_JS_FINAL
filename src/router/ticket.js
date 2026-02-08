import express from "express";
import {
  buyTicket,
  getAllUsersWithTickets,
  getUserByIdWithTickets
} from "../controller/ticket.js";

import auth from "../middleware/auth.js";

const router = express.Router();

//POST /tickets
//Vartotojas perka bilietą
//Reikia galiojančio jwt_token (auth middleware)
router.post("/", auth, buyTicket);

//GET /tickets/users-with-tickets
//Grąžina visus vartotojus su jų bilietais (lookup)
//Reikia jwt_token
router.get("/users-with-tickets", auth, getAllUsersWithTickets);

//GET /tickets/users/:id/tickets
//Grąžina konkretų vartotoją su jo bilietais (lookup)
//Reikia jwt_token
router.get("/users/:id/tickets", auth, getUserByIdWithTickets);

export default router;