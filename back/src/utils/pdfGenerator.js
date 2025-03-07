const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = async (
    certificateNo,
    customerName,
    siteLocation,
    makeModel,
    range,
    serialNo,
    calibrationGas,
    gasCanisterDetails,
    dateOfCalibration,
    calibrationDueDate,
    certificateId,
    observations
) => {
    const doc = new PDFDocument({
        layout: 'portrait',
        size: 'A4',
        margins: { top: 40, left: 50, right: 50, bottom: 40 }
    });

    const certificatesDir = path.join(process.cwd(), "certificates");
    if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir);
    }

    const fileName = path.join(certificatesDir, `${certificateId}.pdf`);
    doc.pipe(fs.createWriteStream(fileName));

    // Background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f5f5f5');

    const pageHeight = doc.page.height; // Get total page height
    const footerY = pageHeight - 120; // Position above the "Authorized Signatory"

    // Border
    // const margin = 30;
    const margin = 50;
    doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
        .lineWidth(2)
        .stroke('#1a237e');

    // Logo
    const logoPath = path.join(process.cwd(), 'src', 'assets', 'thumbnail.png');
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, margin + 10, margin + 10, { width: 160, height: 80 });
    }

    // Company Name
    // doc.font('Helvetica-Bold')
    //     .fontSize(18)
    //     .fillColor('#1a237e')
    //     .text('SPRIER TECHNOLOGY CONSULTANCY', 50, 50, { align: 'center' });

    // Certificate Title

    const column1X = margin + 10;  // Left column start position
    const column2X = 250;  // Right column start position
    const startY = 180;  // Starting Y position
    const lineHeight = 20;  // Space between lines
    let y = startY; // Initialize Y position

    const addRow = (label, value) => {
        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#000')
            .text(label, column1X, y);

        doc.font('Helvetica')
            .text(value, column2X, y);

        y += lineHeight;  // Move Y position down
    };

    doc.moveDown(3);
    doc.y = 150;
    doc.fontSize(22)
        .fillColor('#1a237e')
        .text('CALIBRATION CERTIFICATE', { align: 'center', underline: true })
        .moveDown(2);


    // Add Certificate Fields in Two Columns
    addRow('Certificate No.', ":" + " " + certificateNo);
    addRow('Customer Name', ":" + " " + customerName);
    addRow('Site Location', ":" + " " + siteLocation);
    addRow('Make & Model', ":" + " " + makeModel);
    addRow('Range', ":" + " " + range);
    addRow('Serial No.', ":" + " " + serialNo);
    addRow('Calibration Gas', ":" + " " + calibrationGas);
    addRow('Gas Canister Details', ":" + " " + gasCanisterDetails);
    addRow('Date of Calibration', ":" + " " + new Date(dateOfCalibration).toLocaleDateString());
    addRow('Calibration Due Date', ":" + " " + new Date(calibrationDueDate).toLocaleDateString());

    doc.y = 450;
    doc.fontSize(10)
        .fillColor('#1a237e')
        .text('OBSERVATIONS', { align: 'left', underline: true })
        .moveDown(2);

    // Table headers
    const tableTop = doc.y;
    const tableLeft = margin + 10;
    const colWidths = [40, 150, 150, 140]; // Adjusted column widths
    const rowHeight = 20;

    doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#000')
        .text('Sr. No.', tableLeft + 5, tableTop + 5)
        .text('Concentration of Gas', tableLeft + colWidths[0] + 5, tableTop + 5)
        .text('Monitor Before Calibration', tableLeft + colWidths[0] + colWidths[1] + 5, tableTop + 5)
        .text('Monitor After Calibration', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 5);

    doc.fillColor('#000'); // Reset fill color

    doc.lineWidth(2).strokeColor('#000'); // Set thick dark border

    // Table rows with borders
    observations.forEach((obs, index) => {
        const rowY = tableTop + rowHeight + (index * rowHeight);
        currentX = tableLeft;

        // Draw row borders with a thicker stroke
        colWidths.forEach(width => {
            doc.rect(currentX, rowY, width, rowHeight).stroke();
            currentX += width;
        });

        // Insert text inside cells
        doc.font('Helvetica')
            .text((index + 1).toString(), tableLeft + 5, rowY + 5)
            .text(obs.gas, tableLeft + colWidths[0] + 5, rowY + 5)
            .text(obs.before, tableLeft + colWidths[0] + colWidths[1] + 5, rowY + 5)
            .text(obs.after, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, rowY + 5);
    });

    doc.moveDown(3);
    // Certification Statement
    doc.fontSize(10)
        .font('Helvetica')
        .text(
            'The above-mentioned Gas Detector was calibrated successfully, and the result confirms that the performance of the instrument is within acceptable limits.',
            50, // X position (left margin)
            footerY - 20, // Y position above the footer
            { width: 490, align: 'center' } // Width and alignment
        )
        .moveDown(2);

    // Signature Section
    doc.fontSize(12)
        .text('Authorized Signatory', doc.page.width - margin - 120, doc.y)
        .moveDown(4);

    // Footer
    doc.fontSize(8)
        .text(`Certificate ID: ${certificateId}`, margin + 10, doc.page.height - margin - 40)
        .text(`Generated on: ${new Date().toLocaleString()}`, margin + 10, doc.page.height - margin - 25);

    doc.end();
    return fileName;
};

module.exports = generatePDF;
