require('dotenv').config();
const express = require("express");
const cors = require("cors");
const sequelize = require('./config/database');
const Student = require('./models/Student');
const { sendWelcomeEmail, sendUpdateNotification, sendDeletionNotification } = require('./utils/emailService');

const app = express();
// Configure CORS to allow access from all devices
app.use(cors({
    origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Configure body parsing with increased limits for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        error: {
            message: err.message,
            stack: err.stack
        }
    });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

// Initialize database and create tables
async function initializeDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Initialize database
initializeDatabase();

// Create student
app.post("/create", async (req, res) => {
    try {
        console.log('Received student creation request');
        
        // Validate request body
        if (!req.body) {
            console.error('Empty request body');
            return res.status(400).json({
                success: false,
                message: "Request body is empty"
            });
        }

        console.log('Request body:', req.body);
        
        // Validate required fields
        const { name, email } = req.body;
        if (!name || !email) {
            console.error('Missing required fields:', { name, email });
            return res.status(400).json({
                success: false,
                message: "Name and email are required fields"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        console.log('Creating new student:', req.body);
        const student = await Student.create(req.body);
        console.log('Student created successfully:', student.id);

        // Send welcome email
        try {
            await sendWelcomeEmail(student);
            console.log('Welcome email sent successfully');
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            return res.status(200).json({
                success: true,
                message: "Student added successfully but failed to send welcome email",
                data: student
            });
        }
        
        res.json({
            success: true,
            message: "Student added successfully and welcome email sent",
            data: student
        });
    } catch (error) {
        console.error("Error creating student:", error);
        
        // Handle unique constraint violation
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: "A student with this email already exists"
            });
        }
        
        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error creating student. Please try again."
        });
    }
});

// Get all students
app.get("/getData", async (req, res) => {
    try {
        console.log('Fetching all students');
        const students = await Student.findAll({
            order: [['createdAt', 'DESC']]
        });
        console.log(`Found ${students.length} students`);
        res.json({
            success: true,
            data: students || []
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching students"
        });
    }
});

// Update student
app.put("/update", async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required"
            });
        }

        console.log('Updating student:', id, updateData);
        
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Store old values for comparison
        const oldValues = { ...student.dataValues };
        
        // Update the student
        await student.update(updateData);
        
        // Compare old and new values to find what changed
        const changes = {};
        for (const [key, newValue] of Object.entries(updateData)) {
            if (oldValues[key] !== newValue) {
                changes[key] = {
                    from: oldValues[key],
                    to: newValue
                };
            }
        }
        
        // If there are changes, send notification
        if (Object.keys(changes).length > 0 && student.email) {
            try {
                console.log('Sending update notification for changes:', changes);
                await sendUpdateNotification(student.email, changes);
                console.log('Update notification sent successfully');
                
                res.json({
                    success: true,
                    message: "Student updated successfully and notification email sent",
                    data: student
                });
            } catch (emailError) {
                console.error('Failed to send update notification:', emailError);
                res.json({
                    success: true,
                    message: "Student updated successfully but failed to send notification email",
                    data: student
                });
            }
        } else {
            console.log('No changes to notify or no email available');
            res.json({
                success: true,
                message: "Student updated successfully",
                data: student
            });
        }
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating student"
        });
    }
});

// Delete student
app.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required"
            });
        }

        console.log('Deleting student:', id);
        const student = await Student.findByPk(id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Store email and name before deletion
        const { email, name } = student;

        await student.destroy();
        console.log('Student deleted successfully:', id);

        // Send deletion notification if email exists
        if (email) {
            await sendDeletionNotification(email, name);
        }
        
        res.json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting student"
        });
    }
});

// Configure port
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    initializeDatabase();
});
