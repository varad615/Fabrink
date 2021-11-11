const mongoose = require("mongoose");

const bulkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Bulk = new mongoose.model("Bulk", bulkSchema);

module.exports = Bulk;