import mongoose from "mongoose";

// Ticket Schema – apibrėžia, kaip saugomas bilietas DB
const ticketSchema = new mongoose.Schema(
  {
    //pvz., "Trip to Paris"
    title: {type: String, required: true, trim: true},

    //negali būti neigiama
    price: {type: Number, required: true, min: 0},
    
    from: {type: String, required: true, trim: true},
    to: {type: String, required: true, trim: true},

    // Nuotraukos URL (nebūtinas laukas)
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

// Eksportuojame Ticket modelį
export default mongoose.model("Ticket", ticketSchema);