const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define the UserSchema with various fields and their properties
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that the email is unique for each user
  },
  password: {
    type: String,
    required: true, // The password is required for each user
  },
  name: {
    type: String,
    required: true, // The name is required for each user
  },
  phone: {
    type: Number, // Phone number field (optional)
  },
  photo: {
    type: String, // Photo field (optional)
  },
  role: {
    type: String,
    enum: ["patient", "admin"], // Role can only be "patient" or "admin"
    default: "patient", // Default role is set to "patient"
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"], // Gender can only be "male", "female", or "other"
  },
  bloodType: {
    type: String, // Blood type field (optional)
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }], // Array of ObjectIds referencing the "Appointment" model
});

// Export the model "UserDoctor" using the defined UserSchema
module.exports = mongoose.model("UserDoctor", UserSchema);
