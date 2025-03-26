# Database-Backup-Email-Script-Node.js-
🚀 Node.js Backup Script

📁 Setup Instructions

1️⃣ Install Node.js & Dependencies

Ensure Node.js is installed. You can check by running:

node -v
npm -v

If not installed, download from: https://nodejs.org/

Then, install required dependencies:

npm install nodemailer dotenv node-cron

2️⃣ Configure Environment Variables

Create a .env file in the project root:

# MySQL Database Credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=test

# Email SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_TO=recipient-email@gmail.com

 Generate an "App Password" (Recommended)
Since Google no longer allows normal passwords, you need to generate an App Password:

✅ Steps to Generate App Password:

Go to  Google App Passwords

Select "Mail" as the app and "Windows Computer" as the device.

Click "Generate", and copy the 16-character password.

Replace your Gmail password in .env file with the new App Password.


3️⃣ Run the Script
node backup.js
