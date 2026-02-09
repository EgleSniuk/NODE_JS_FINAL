
import mongoose from "mongoose";

// User Schema – apibrėžia, kaip saugomas vartotojas DB
const userSchema = new mongoose.Schema(
  {
    id: {type: String, required: true, unique: true},
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    money_balance: {type: Number, required: true, min: 0},
    tickets: [{type: mongoose.Schema.Types.ObjectId, ref: "Ticket"}]
  },

  {
    // Automatiškai prideda createdAt ir updatedAt laukus
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
