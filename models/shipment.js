const mongoose = require("mongoose");
const Order = require("./order");

const shipmentSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    orderPrice: {
        type: Number,
        required: true
    },
    email: {
        type: String,
    },
    phone: String,
    country: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    pincode: String,
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
});

const Shipment = new mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;