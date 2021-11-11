const mongoose = require("mongoose");
const Order = require("./order");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
         required: true
    },
    logo: {
        url: String,
        filename: String
    },
    phone: String,
    businessName: String,
    brandName: String,
    country: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    pincode: String,
    gstin: String,
    website: String,
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
});

const User = new mongoose.model("User", userSchema);

module.exports = User;