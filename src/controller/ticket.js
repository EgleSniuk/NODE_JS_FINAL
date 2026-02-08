import { v4 as uuid } from "uuid";
import TicketModel from "../models/ticket.js";
import UserModel from "../models/user.js";

// CREATE TICKET (POST /tickets)
export const buyTicket = async (req, res) => {

  // REST modelio laukai, ateinantys iš kliento
  const { title, price, from, to, photoUrl } = req.body;

  // userId ateina iš auth middleware (iš JWT tokeno)
  const userId = req.user.userId;

  // FIND USER
  // Ieškome vartotojo pagal jo UUID (ne MongoDB _id)
  const user = await UserModel.findOne({ id: userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // CHECK BALANCE
  // Tikriname, ar vartotojas turi pakankamai pinigų bilietui
  if (user.money_balance < price) {
    return res.status(400).json({ message: "Not enough money" });
  }

  // CREATE TICKET
  // Kuriame naują bilietą ir susiejame jį su vartotoju
  const ticket = new TicketModel({
    id: uuid(),     // Unikalus bilieto ID (jei norėtum naudoti)
    title,
    price,
    from,
    to,
    photoUrl,
    user: user._id   // MongoDB ObjectId ryšiui su User kolekcija
  });

  // Išsaugome bilietą DB
  await ticket.save();

  // UPDATE USER: add ticket + subtract money
  // Pridedame bilieto _id į vartotojo bilietų masyvą
  user.tickets.push(ticket._id);
  
  // Atimame bilieto kainą iš vartotojo balanso
  user.money_balance -= price;

  // Išsaugome atnaujintą vartotoją
  await user.save();

  // Grąžiname sėkmingą atsakymą
  return res.status(200).json({
    message: "Ticket purchased successfully",
    ticket
  });
};

// GET ALL USERS WITH TICKETS (GET /users-with-tickets)
export const getAllUsersWithTickets = async (req, res) => {
  // Naudojame MongoDB agregaciją su $lookup
  const users = await UserModel.aggregate([
    {
      // Sujungiame vartotojus su jų bilietais pagal ObjectId
      $lookup: {
        from: "tickets",          // Kolekcijos pavadinimas MongoDB
        localField: "tickets",    // User.tickets masyvas
        foreignField: "_id",      // Ticket._id
        as: "tickets"             // Kaip pavadinsime sujungtą masyvą
      }
    },
    {
      // Rūšiuojame vartotojus pagal vardą A → Z
      $sort: { name: 1 }
    }
  ]);

  return res.status(200).json({ users });
};

// GET USER BY ID WITH TICKETS (GET /users/:id/tickets)
export const getUserByIdWithTickets = async (req, res) => {
  const id = req.params.id;

  // Agregacija su filtru ir lookup
  const users = await UserModel.aggregate([
    { $match: { id: id } },  // Ieškome pagal UUID
    {
      $lookup: {
        from: "tickets",
        localField: "tickets",
        foreignField: "_id",
        as: "tickets"
      }
    }
  ]);

  // Jei vartotojas nerastas
  if (users.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  // Grąžiname pirmą (ir vienintelį) rastą vartotoją
  return res.status(200).json({ user: users[0] });
};