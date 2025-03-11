const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDFService = async (
    nameAndLocation,
    contactPerson,
    contactNumber,
    serviceEngineer,
    date,
    place,
    placeOptions,
    natureOfJob,
    reportNo,
    makeModelNumberoftheInstrumentQuantity,
    serialNumberoftheInstrumentCalibratedOK,
    serialNumberoftheFaultyNonWorkingInstruments,
    engineerRemarks,
    engineerName,
    serviceId
) => {
    const doc = new PDFDocument({
        layout: 'portrait',
        size: 'A4',
        margins: { top: 40, left: 50, right: 50, bottom: 40 }
    });

    const servicesDir = path.join(process.cwd(), "services");
    if (!fs.existsSync(servicesDir)) {
        fs.mkdirSync(servicesDir);
    }

    const fileName = path.join(servicesDir, `${serviceId}.pdf`);
    doc.pipe(fs.createWriteStream(fileName));

    // Background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

    const pageHeight = doc.page.height;
    const footerY = pageHeight - 120;

    // Border
    const margin = 50;
    doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
        .lineWidth(2)
        .stroke('#000');

    // Logo
    const logoPath = path.join(process.cwd(), 'src', 'assets', 'thumbnail.png');
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, margin + 10, margin + 10, { width: 160, height: 80 });
    }

    const column1X = margin + 10;
    const column2X = 250;
    const startY = 180;
    const lineHeight = 20;
    let y = startY;

    const addRow = (label, value, extraSpace = false) => {
        if (extraSpace) y += 0;

        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#000')
            .text(label, column1X, y);

        doc.font('Helvetica')
            .text(value, column2X, y);

        y += lineHeight;
        if (extraSpace) y += 20;
    };

    const addRow1 = (label, value, extraSpace = false) => {
        if (extraSpace) y += 80;

        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#000')
            .text(label, column1X, y);

        doc.font('Helvetica')
            .text(value, column2X, y);

        y += lineHeight;
        if (extraSpace) y += 80;
    };



    doc.moveDown(3);
    doc.y = 150;
    doc.fontSize(16)
        .fillColor('#1a237e')
        .text('SERVICE REPORT', { align: 'center', underline: true })
        .moveDown(2);

    // Add Service Fields
    // addRow('Name and Location', ":" + " " + nameAndLocation);
    // addRow('Contact Person', ":" + " " + contactPerson);
    // addRow('Contact Number', ":" + " " + contactNumber);
    // addRow('Service Engineer', ":" + " " + serviceEngineer);
    // addRow('Date', ":" + " " + new Date(date).toLocaleDateString());
    // addRow('Place', ":" + " " + place);
    // addRow('Place Options', ":" + " " + placeOptions);
    // addRow('Nature of Job', ":" + " " + natureOfJob);
    // addRow('Report No.', ":" + " " + reportNo);
    // addRow('Make & Model Number', ":" + " " + makeModelNumberoftheInstrumentQuantity, true);
    // addRow1('Calibrated & Tested OK', ":" + " " + serialNumberoftheInstrumentCalibratedOK);
    // addRow('Sr.No Faulty/Non-Working', ":" + " " + serialNumberoftheFaultyNonWorkingInstruments);

    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Customer Name: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(nameAndLocation)
        .moveDown(2);

    // Contact Person
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Contact Person: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(contactPerson)
        .moveDown(2);

    // Contact Number
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Contact Number: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(contactNumber)
        .moveDown(2);

    // Service Engineer
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Service Engineer: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(serviceEngineer)
        .moveDown(2);

    // Date
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Date: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(date)
        .moveDown(2);

    // Place
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Place: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(place)
        .moveDown(2);

    // Place Options
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Place Options: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(placeOptions)
        .moveDown(2);

    // Nature of Job
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Nature of Job: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(natureOfJob)
        .moveDown(2);

    // Report No.
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Report No.: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(reportNo)
        .moveDown(2);

    // Make & Model Number
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Make & Model Number: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(makeModelNumberoftheInstrumentQuantity)
        .moveDown(2);

    // Calibrated & Tested OK
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Calibrated & Tested OK: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(serialNumberoftheInstrumentCalibratedOK)
        .moveDown(2);

    // Sr.No Faulty/Non-Working
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000')
        .text('Sr.No Faulty/Non-Working: ', margin + 10, doc.y, { continued: true });
    doc.font('Helvetica')
        .text(serialNumberoftheFaultyNonWorkingInstruments)
        .moveDown(2);

    // Engineer Remarks Table
    doc.y = 850;
    doc.fontSize(10)
        .fillColor('#000')
        .text('ENGINEER REMARKS', { align: 'left', underline: true })
        .moveDown(2);

    const tableTop = doc.y;
    const tableLeft = margin + 10;
    const colWidths = [40, 150, 80, 80, 100];
    const rowHeight = 20;

    // Draw header borders
    doc.fillColor('#000')
        .rect(tableLeft, tableTop, colWidths[0], rowHeight).stroke()
        .rect(tableLeft + colWidths[0], tableTop, colWidths[1], rowHeight).stroke()
        .rect(tableLeft + colWidths[0] + colWidths[1], tableTop, colWidths[2], rowHeight).stroke()
        .rect(tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop, colWidths[3], rowHeight).stroke()
        .rect(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop, colWidths[4], rowHeight).stroke();

    doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#000')
        .text('Sr. No.', tableLeft + 5, tableTop + 5)
        .text('Service/Spares', tableLeft + colWidths[0] + 5, tableTop + 5)
        .text('Part No.', tableLeft + colWidths[0] + colWidths[1] + 5, tableTop + 5)
        .text('Rate', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 5)
        .text('Quantity', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, tableTop + 5)
        .text('PO No.', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + 5, tableTop + 5);

    doc.fillColor('#000');
    doc.lineWidth(2).strokeColor('#000');

    // Table rows with borders
    engineerRemarks.forEach((remark, index) => {
        const rowY = tableTop + rowHeight + (index * rowHeight);
        let currentX = tableLeft;

        colWidths.forEach(width => {
            doc.rect(currentX, rowY, width, rowHeight).stroke();
            currentX += width;
        });

        doc.font('Helvetica')
            .text((index + 1).toString(), tableLeft + 5, rowY + 5)
            .text(remark.serviceSpares, tableLeft + colWidths[0] + 5, rowY + 5)
            .text(remark.partNo, tableLeft + colWidths[0] + colWidths[1] + 5, rowY + 5)
            .text(remark.rate, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, rowY + 5)
            .text(remark.quantity, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, rowY + 5)
            .text(remark.poNo, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + 5, rowY + 5);
    });

    doc.moveDown(3);
    // Service Statement
    doc.fontSize(10)
        .font('Helvetica')
        .text(
            'The above-mentioned service was performed successfully according to the specified requirements.',
            50,
            footerY - 50,
            { width: 490, align: 'center' }
        )
        .moveDown(2);

    // Signature Section
    doc.fontSize(14)
        .text('Service Engineer', doc.page.width - margin - 140, doc.y)
        .text(engineerName, doc.page.width - margin - 120, doc.y + 20)
        .moveDown(4);

    // Footer
    doc.fontSize(8)
        .text(`Report No: ${reportNo}`, margin + 10, doc.page.height - margin - 40)
        .text(`Generated on: ${new Date().toLocaleString()}`, margin + 10, doc.page.height - margin - 25);

    doc.end();
    return fileName;
};

module.exports = generatePDFService;
