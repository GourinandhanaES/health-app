const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://gourinandhana028:gourinandhana@cluster0.6lz2v.mongodb.net/health-manager-db';

async function initDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        const patientSchema = new mongoose.Schema({
            name: String,
            age: Number,
            condition: String,
            status: String,
            lastVisit: String,
       
        }, { timestamps: true });

        const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

        console.log('Creating sample patient...');
        const patient = await Patient.create({
            name: 'Initial Setup User',
            age: 30,
            condition: 'System Check',
            status: 'Stable',
            lastVisit: new Date().toISOString().split('T')[0],
       
        });

        console.log('Sample patient created:', patient);
        console.log('Database should now be visible in Atlas.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

initDB();
