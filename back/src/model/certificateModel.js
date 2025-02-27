const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    certificateId: { 
        type: String, 
        unique: true,
        default: () => `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        index: true
    },
    customerName: { type: String, required: true },
    siteLocation: { type: String, required: true },
    makeModel: { type: String, required: true },
    range: { type: String, required: true },
    serialNo: { type: String, required: true },
    calibrationGas: { type: String, required: true },
    gasCanisterDetails: { type: String, required: true },
    dateOfCalibration: { type: Date, required: true },
    calibrationDueDate: { type: Date, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("Certificate", certificateSchema);
