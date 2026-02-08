import jwt from "jsonwebtoken";

// Tikrina ar vartotojas turi galiojantį JWT tokeną

const auth = (req, res, next) => {
  // JWT tokenas turi būti siunčiamas per Authorization header
  // Pvz.: Authorization: <jwt_token>
  const token = req.headers.authorization;

  // Jei tokeno nėra → vartotojas neprisijungęs
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Tikriname tokeno galiojimą
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Jei tokenas negalioja arba pasibaigęs
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Įdedame vartotojo duomenis į req objektą,
    // kad controlleriai galėtų juos naudoti
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    // Leidžiame tęsti į sekantį middleware arba controllerį
    next();
  });
};

export default auth;