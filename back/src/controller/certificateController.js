const Certificate = require("../model/certificateModel");
const generatePDF = require("../utils/pdfGenerator");
const path = require("path");
const fs = require("fs");

exports.createCertificate = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { customerName, siteLocation, makeModel, range, serialNo, calibrationGas, gasCanisterDetails, dateOfCalibration, calibrationDueDate } = req.body;

        // Validate required fields
        if (!customerName ||
            !siteLocation ||
            !makeModel ||
            !range ||
            !serialNo ||
            !calibrationGas ||
            !gasCanisterDetails ||
            !dateOfCalibration ||
            !calibrationDueDate
        ) {
            console.error("Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const newCertificate = new Certificate({
            customerName,
            siteLocation,
            makeModel,
            range,
            serialNo,
            calibrationGas,
            gasCanisterDetails,
            dateOfCalibration: new Date(dateOfCalibration),
            calibrationDueDate: new Date(calibrationDueDate)
        });

        console.log("Saving certificate to database...");
        await newCertificate.save();
        console.log("Certificate saved successfully");

        console.log("Generating PDF...");
        const pdfPath = await generatePDF(
            customerName,
            siteLocation,
            makeModel,
            range,
            serialNo,
            calibrationGas,
            gasCanisterDetails,
            dateOfCalibration,
            calibrationDueDate,
            newCertificate.certificateId
        );
        console.log("PDF generated successfully at:", pdfPath);

        res.status(201).json({
            message: "Certificate generated successfully!", 
            certificateId: newCertificate.certificateId,
            downloadUrl: `/api/v1/certificates/download/${newCertificate.certificateId}`
        });
    } catch (error) {
        console.error("Certificate generation error:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ error: "Failed to generate certificate: " + error.message });
    }
};

exports.downloadCertificate = async (req, res) => {
    try {
        console.log("Received request params:", req.params);
        const { certificateId } = req.params;
        const pdfPath = path.join(process.cwd(), "certificates", `${certificateId}.pdf`);

        if (!fs.existsSync(pdfPath)) {
            console.error(`Certificate file not found at path: ${pdfPath}`);
            return res.status(404).json({ error: "Certificate not found" });
        }

        console.log("Setting response headers...");
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${certificateId}.pdf`);

        console.log("Creating read stream...");
        const stream = fs.createReadStream(pdfPath);
        stream.on('error', function (error) {
            console.error("Error streaming certificate:", error);
            console.error("Error stack:", error.stack);
            res.status(500).json({ error: "Failed to download certificate: " + error.message });
        });

        console.log("Piping stream to response...");
        stream.pipe(res);
    } catch (error) {
        console.error("Certificate download error:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ error: "Failed to download certificate: " + error.message });
    }
};
