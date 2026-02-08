import express from "express";
import {
  signUp,
  login,
  getNewJwtToken
} from "../controller/user.js";

const router = express.Router();

//POST /users
//Vartotojo registracija
router.post("/", signUp);

//POST /users/login
//Vartotojo prisijungimas
router.post("/login", login);


//POST /users/refresh
// Naujo jwt_token gavimas naudojant refresh_token
router.post("/refresh", getNewJwtToken);

export default router;