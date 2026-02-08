
import mongoose from "mongoose";

// User Schema – apibrėžia, kaip saugomas vartotojas DB
const userSchema = new mongoose.Schema(
  {
    // Unikalus vartotojo identifikatorius (UUID, ne MongoDB _id)
    id: {type: String, required: true, unique: true},
    
    // Vartotojo vardas (trim pašalina tarpus)
    name: {type: String, required: true, trim: true},

    // El. paštas (unikalus, automatiškai paverčiamas į mažąsias)
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    
    // Užšifruotas slaptažodis (bcrypt hash)
    password: {type: String, required: true},
    
    // Vartotojo pinigų balansas (negali būti neigiamas)
    money_balance: {type: Number, required: true, min: 0},
    
    // Masyvas bilietų, priklausančių vartotojui
    // Saugo Ticket dokumentų _id
    tickets: [{type: mongoose.Schema.Types.ObjectId, ref: "Ticket"}]
  },

  {
    // Automatiškai prideda createdAt ir updatedAt laukus
    timestamps: true
  }
);

// Eksportuojame User modelį
export default mongoose.model("User", userSchema);
