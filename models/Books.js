//CHANGE THIS

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bookSchema = new mongoose.Schema(
  {
    user: {
      //CHANGE THIS
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      default: "Title",
    },
    isbn: {
      type: String,
      default: "",
    },

    addedDate: {
      type: String,
      default: "",
    },
    deletedDate: {
      type: String,
      default: "",
    },
    storyline: {
      type: String,
      default: "",
    },
    numberOfReadings: {
      type: Number,
      default: 0,
    },
  },
  {
    timeStamps: true,
  }
);

//CHANGE THIS
// creates IDs
bookSchema.plugin(AutoIncrement, {
  inc_field: "bookID",
  id: "bookNum",
  start_seq: 0,
});

module.exports = mongoose.model("Book", bookSchema);

/* Titolo
● Autore
● Codice ISBN
● Data di aggiunta alla liberia
● Data di eliminazione (se cancellato)
● Trama
● Numero di letture complete */
