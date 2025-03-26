const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { exec } = require('child_process');

// Function to export the database
const exportDatabase = () => {
    const fileName = `backup_${new Date().toISOString().split('T')[0]}.sql`;
    const filePath = path.join(__dirname, fileName);

    console.log(' Starting database export...');

    // MySQL Dump command
    const dumpCommand = `mysqldump --column-statistics=0 -h ${process.env.DB_HOST} -u ${process.env.DB_USER} --password="${process.env.DB_PASSWORD}" ${process.env.DB_NAME} > "${filePath}"`;

    exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(` Error exporting database: ${error.message}`);
            return;
        }
        if (stderr) {
            console.warn(` Warning: ${stderr}`); // Logs warnings without stopping execution
        }

        console.log(` Database exported successfully: ${filePath}`);

        // Send the backup via email
        sendBackupEmail(filePath);
    });
};

// Function to send the backup file via email
const sendBackupEmail = (filePath) => {
    console.log('Preparing to send email with backup...');

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Use `true` for 465, `false` for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // Prevent SSL issues
        },
        debug: true, // Enable debugging
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: 'Database Backup',
        text: 'Here is the latest database backup file.',
        attachments: [
            {
                filename: path.basename(filePath),
                path: filePath,
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(` Error sending email: ${error.message}`);
        } else {
            console.log(` Email sent successfully: ${info.response}`);

            // Delete backup file after sending
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(` Error deleting backup file: ${err.message}`);
                } else {
                    console.log(' Backup file deleted after email.');
                }
            });
        }
    });
};

// Immediate backup for testing
exportDatabase();

// ✅ **CRON: Schedule task to run every day at 2:00 AM**
cron.schedule('0 2 * * *', () => {
    console.log(' Running scheduled database backup...');
    exportDatabase();
});

console.log(' Database backup and email script is running...');
