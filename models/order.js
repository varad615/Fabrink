const mongoose = require("mongoose");
const Shipment = require("./shipment");

const orderSchema = new mongoose.Schema({
    designName: {
        type: String,
        // required: true
        default: "New Design"
    },
    status: {
        type: String,
        default: "To Be Printed"
    },
    shipmentStatus: {
        type: String,
        default: "Pending"
    },
    size: {
        type: String,
        default: "M"
    },
    color: String,
    quantity: Number,
    remark: String,
    price: {
        type: Number,
        // min: 0
    },
    type: {
        type: String
    },
    printType: {
        type: String
    },
    date: {
        type: Date,
        default: new Date()
    },
    design: {
        url: String,
        filename: String
    },
    shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shipment"
    },
    printPrice: Number

});

const Order = new mongoose.model("Order", orderSchema);

module.exports = Order;