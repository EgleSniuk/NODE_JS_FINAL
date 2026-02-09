import mongoose from "mongoose";

// Ticket Schema – apibrėžia, kaip saugomas bilietas DB
const ticketSchema = new mongoose.Schema(
  {
    title: {type: String, required: true, trim: true},
    price: {type: Number, required: true, min: 0},
    from: {type: String, required: true, trim: true},
    to: {type: String, required: true, trim: true},
    photoUrl: {type: String, trim: true},

    // Ryšys su vartotoju (kiekvienas bilietas priklauso vienam vartotojui
    // Saugo userId iš User kolekcijos
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
  },

  {
    // Automatiškai prideda createdAt ir updatedAt laukus
    timestamps: true
  }
);

export default mongoose.model("Ticket", ticketSchema);