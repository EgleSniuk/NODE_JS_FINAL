import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import UserModel from "../models/user.js";

// REGISTER USER (POST /users)
export const signUp = async (req, res) => {
  const { name, email, password, money_balance } = req.body;

  // VALIDATION - Email turi turėti "@"
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Validation failed: bad email" });
  }

  // Vardas → pirmoji raidė didžioji
  const formattedName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  // Slaptažodis: min 6 simboliai + bent 1 skaičius
  // /\d/ yra regular expression, kuris reiškia „bet koks skaičius“
  const hasNumber = /\d/.test(password); 
  if (password.length < 6 || !hasNumber) {
    return res
      .status(400)
      .json({ message: "Validation failed: bad password" });
  }

  // HASH PASSWORD
  // Sukuriame "salt" – atsitiktinį priedą slaptažodžio saugumui
  const salt = bcrypt.genSaltSync(10);
  // Užšifruojame slaptažodį su bcrypt
  const hashedPassword = bcrypt.hashSync(password, salt);

  // CREATE USER
  // Kuriame naują vartotoją su UUID id
  const user = new UserModel({
    id: uuid(),               // Unikalus vartotojo ID (ne MongoDB _id)
    name: formattedName,
    email,
    password: hashedPassword,
    money_balance,
    tickets: []               // REST modelyje vadinasi "tickets"
  });

  await user.save();
 
  // GENERATE TOKENS
  // JWT tokenas (galioja 2 valandas)
  const jwt_token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // Refresh tokenas (galioja 1 dieną)
  const jwt_refresh_token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  );

  // Grąžiname sėkmingą atsakymą
  return res.status(200).json({
    message: "User created successfully",
    jwt_token,
    jwt_refresh_token
  });
};

// LOGIN USER (POST /auth/login)
export const login = async (req, res) => {
  const { email, password } = req.body;

  // FIND USER BY EMAIL
  // Ieškome vartotojo pagal email
  const user = await UserModel.findOne({ email });

  // Jei vartotojas nerastas – grąžiname bendrą klaidą
  if (!user) {
    return res.status(404).json({ message: "Bad email or password" });
  }

  // CHECK PASSWORD
  // Tikriname slaptažodį su bcrypt
  const isMatch = bcrypt.compareSync(password, user.password);

  // Jei slaptažodis neteisingas – grąžiname tą pačią klaidą
  if (!isMatch) {
    return res.status(404).json({ message: "Bad email or password" });
  }

  // GENERATE TOKENS
  // Sukuriame naują JWT tokeną
  const jwt_token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // Sukuriame refresh tokeną
  const jwt_refresh_token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  );

  // Grąžiname sėkmingą atsakymą
  return res.status(200).json({
    message: "Login successful",
    jwt_token,
    jwt_refresh_token
  });
};

// REFRESH JWT TOKEN (POST /auth/refresh)
export const getNewJwtToken = async (req, res) => {
  const { refresh_token } = req.body;

  // Refresh token privalomas
  if (!refresh_token) {
    return res.status(400).json({ message: "Please login again" });
  }

  // Patikriname refresh token galiojimą
  jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Please login again" });
    }

    // Sukuriame naują JWT tokeną
    const new_jwt_token = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Grąžiname naują JWT tokeną ir tą patį refresh token
    return res.status(200).json({
      jwt_token: new_jwt_token,
      jwt_refresh_token: refresh_token
    });
  });
};