const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Connect to separate MongoDB databases for each role
const technicianDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const clientDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const repairerDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define schema and models for each role
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Technician = technicianDB.model("Technician", userSchema);
const Client = clientDB.model("Client", userSchema);
const Repairer = repairerDB.model("Repairer", userSchema);

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.technician) {
        return next();
    } else {
        return res.redirect('/technician');
    }
}

// Routes for serving login pages
app.get('/technician', (req, res) => {
    res.sendFile(path.join(__dirname, 'technicianLogin.html'));
});

app.get('/client', (req, res) => {
    res.sendFile(path.join(__dirname, 'clientLogin.html'));
});

app.get('/repairer', (req, res) => {
    res.sendFile(path.join(__dirname, 'repairerLogin.html'));
});

app.get('/chat', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Route to serve the technician form after login
app.get('/technicianForm', (req, res) => {
    res.sendFile(path.join(__dirname, 'technicianForm.html'));
});


// Handle login for technicians
app.post('/TechnicianLogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the technician by username
        const technician = await Technician.findOne({ username });

        // Check if technician exists and the password matches
        if (technician && technician.password === password) {
            console.log("Technician logged in successfully:", username);
            res.redirect('/technicianForm'); // Redirect to the form page after successful login
        } else {
            console.error("Invalid credentials for technician:", username);
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error("Error occurred during technician login:", error);
        res.status(500).send("Error occurred during login");
    }
});


// Handle form submission for technicians (after login)
app.post('/TechnicianPost', isAuthenticated, async (req, res) => {
    const {
        truckSerialNumber,
        truckModel,
        inspectionID,
        inspectorName,
        inspectionEmployeeID,
        inspectionDateTime,
        location,
        geoCoordinates,
        serviceMeterHours,
        inspectorSignature,
        customerName,
        customerID
    } = req.body;

    try {
        const technicianData = new Technician({
            truckSerialNumber,
            truckModel,
            inspectionID,
            inspectorName,
            inspectionEmployeeID,
            inspectionDateTime: new Date(inspectionDateTime), // Convert to Date object
            location,
            geoCoordinates,
            serviceMeterHours,
            inspectorSignature,
            customerName,
            customerID
        });

        await technicianData.save();
        console.log("Saved technician data:", technicianData);
        res.redirect('/chat'); // Redirect to chat.html after successful submission
    } catch (error) {
        console.error("Error saving technician data:", error);
        res.status(500).send("Error occurred while saving data");
    }
});

app.listen(port, () => {
    console.log("Server is Running on port " + port);
});
