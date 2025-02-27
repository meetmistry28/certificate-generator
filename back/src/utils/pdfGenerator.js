const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = async (
    customerName,
    siteLocation,
    makeModel,
    range,
    serialNo,
    calibrationGas,
    gasCanisterDetails,
    dateOfCalibration,
    calibrationDueDate,
    certificateId
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

    // Border
    const margin = 30;
    doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
        .lineWidth(2)
        .stroke('#1a237e');

    // Logo
    const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo.jpg');
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, margin + 10, margin + 10, { width: 80 });
    }

    // Company Name
    doc.font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#1a237e')
        .text('SPRIER TECHNOLOGY CONSULTANCY', margin + 20, doc.y, { align: 'center' });

    // Certificate Title
    doc.moveDown(3);
    doc.fontSize(22)
        .fillColor('#1a237e')
        .text('CALIBRATION CERTIFICATE', { align: 'center', underline: true })
        .moveDown(2);

    // Customer Name
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Customer Name: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(customerName)
        .moveDown(2);

    // Site Location
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Site Location: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(siteLocation)
        .moveDown(2);

    // Make Model
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Make Model: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(makeModel)
        .moveDown(2);

    // Range
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Range: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(range)
        .moveDown(2);

    // Serial No
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Serial No: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(serialNo)
        .moveDown(2);

    // Calibration Gas
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Calibration Gas: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(calibrationGas)
        .moveDown(2);

    // Gas Canister Details
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Gas Canister Details: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(gasCanisterDetails)
        .moveDown(2);

    // Date of Calibration
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Date of Calibration: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(new Date(dateOfCalibration).toLocaleDateString())
        .moveDown(2);

    // Calibration Due Date
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Calibration Due Date: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(new Date(calibrationDueDate).toLocaleDateString())
        .moveDown(2);

    // Certification Statement
    doc.fontSize(10)
        .text('This certifies that the above instrument has been calibrated as per standard procedures using equipment traceable to national standards.', {
            align: 'justify'
        })
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
