const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'shaikjamalvali2004@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false}
}); 
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email transporter verification failed:', error);
        console.error('Email Config:', {
            user: 'shaikjamalvali2004@gmail.com',
            passwordProvided: !!process.env.EMAIL_APP_PASSWORD,
            passwordLength: process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0
        });
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendWelcomeEmail = async (student) => {
    console.log('Starting welcome email process...');
    
    if (!process.env.EMAIL_APP_PASSWORD) {
        console.error('EMAIL_APP_PASSWORD is not set in environment variables');
        throw new Error('Email configuration is missing');
    }
    
    if (!student || !student.email) {
        console.error('Invalid student data for welcome email:', student);
        throw new Error('Invalid student data');
    }
    
    console.log('Email configuration:', {
        host: 'smtp.gmail.com',
        port: 587,
        user: 'shaikjamalvali2004@gmail.com',
        passwordProvided: !!process.env.EMAIL_APP_PASSWORD,
        passwordLength: process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0,
        studentEmail: student.email
    });
    try {
        const mailOptions = {
            from: 'shaikjamalvali2004@gmail.com',
            to: student.email,
            subject: 'Welcome to NIT Warangal Student Management System',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a237e;">Welcome to NIT Warangal!</h2>
                    <p>Dear ${student.name},</p>
                    
                    <p>Welcome to the National Institute of Technology, Warangal. Your student profile has been successfully created in our Student Management System.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #1a237e;">Your Details:</h3>
                        <ul style="list-style: none; padding-left: 0;">
                            <li><strong>Student ID:</strong> ${student.id}</li>
                            <li><strong>Name:</strong> ${student.name}</li>
                            <li><strong>Email:</strong> ${student.email}</li>
                            <li><strong>Class:</strong> ${student.class || 'Not specified'}</li>
                            <li><strong>Grade:</strong> ${student.grade || 'Not specified'}</li>
                        </ul>
                    </div>
                    
                    <p>If you need to update any information or have questions, please contact the administrative office.</p>
                    
                    <div style="margin-top: 30px;">
                        <p>Best regards,</p>
                        <p><strong>Student Management System</strong></p>
                        <p>National Institute of Technology, Warangal</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', student.email);
    } catch (error) {
        console.error('Error sending welcome email:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command
        });
        throw error; // Throw the error so the API can handle it
    }
};

// Function to send update notification
const sendUpdateNotification = async (studentEmail, updatedFields) => {
    console.log('Starting update notification process...');
    
    if (!process.env.EMAIL_APP_PASSWORD) {
        console.error('EMAIL_APP_PASSWORD is not set in environment variables');
        throw new Error('Email configuration is missing');
    }
    
    if (!studentEmail) {
        console.error('Student email is missing for update notification');
        throw new Error('Student email is required');
    }

    console.log('Update notification details:', {
        studentEmail,
        updatedFields,
        emailConfigured: !!process.env.EMAIL_APP_PASSWORD
    });

    try {
        // Create a formatted list of updated fields
        const changesHtml = Object.entries(updatedFields)
            .map(([key, value]) => {
                if (value.from !== undefined && value.to !== undefined) {
                    return `<li><strong>${key}:</strong> Changed from "${value.from}" to "${value.to}"</li>`;
                }
                return `<li><strong>${key}:</strong> ${value}</li>`;
            })
            .join('');

        const mailOptions = {
            from: 'shaikjamalvali2004@gmail.com',
            to: studentEmail,
            subject: 'Your Student Profile Has Been Updated',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a237e;">NIT Warangal - Student Profile Update</h2>
                    <p>Dear Student,</p>
                    <p>Your profile has been updated with the following changes:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <ul style="list-style: none; padding-left: 0;">
                            ${changesHtml}
                        </ul>
                    </div>
                    <p>If you did not authorize these changes, please contact the administrator immediately.</p>
                    <div style="margin-top: 30px;">
                        <p>Best regards,</p>
                        <p><strong>Student Management System</strong></p>
                        <p>National Institute of Technology, Warangal</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Update notification email sent successfully to:', studentEmail);
    } catch (error) {
        console.error('Error sending update notification:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command,
            studentEmail: studentEmail
        });
        throw error; // Throw the error so it can be handled by the API
    }
};

// Function to send deletion notification
const sendDeletionNotification = async (studentEmail, studentName) => {
    console.log('Starting deletion notification process...');
    
    if (!process.env.EMAIL_APP_PASSWORD) {
        console.error('EMAIL_APP_PASSWORD is not set in environment variables');
        throw new Error('Email configuration is missing');
    }
    
    if (!studentEmail || !studentName) {
        console.error('Missing required data for deletion notification:', { studentEmail, studentName });
        throw new Error('Student email and name are required');
    }

    console.log('Deletion notification details:', {
        studentEmail,
        studentName,
        emailConfigured: !!process.env.EMAIL_APP_PASSWORD
    });

    try {
        const mailOptions = {
            from: 'shaikjamalvali2004@gmail.com',
            to: studentEmail,
            subject: 'Your Student Profile Has Been Removed',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a237e;">NIT Warangal - Profile Deletion Notice</h2>
                    <p>Dear ${studentName},</p>
                    <p>This email is to confirm that your student profile has been removed from our system.</p>
                    <p>If you believe this was done in error, please contact the administrator immediately.</p>
                    <div style="margin-top: 30px;">
                        <p>Best regards,</p>
                        <p><strong>Student Management System</strong></p>
                        <p>National Institute of Technology, Warangal</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Deletion notification email sent successfully to:', studentEmail);
    } catch (error) {
        console.error('Error sending deletion notification:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command,
            studentEmail: studentEmail,
            studentName: studentName
        });
        throw error; // Throw the error so it can be handled by the API
    }
};

module.exports = {
    sendWelcomeEmail,
    sendUpdateNotification,
    sendDeletionNotification
};
