const mongoose = require('mongoose');

// Standard connection string bypassing SRV lookup
const MONGODB_URI = 'mongodb://gourinandhana028:gourinandhana@cluster0-shard-00-00.6lz2v.mongodb.net:27017,cluster0-shard-00-01.6lz2v.mongodb.net:27017,cluster0-shard-00-02.6lz2v.mongodb.net:27017/health-manager-db?ssl=true&replicaSet=atlas-2a9s4k-shard-0&authSource=admin&retryWrites=true&w=majority';
// Note: replicaSet name 'atlas-2a9s4k-shard-0' is a guess/example. If this fails, we tried.
// Actually, let's try a simpler one without replicaSet first, or just the direct node.
const SIMPLE_URI = 'mongodb://gourinandhana028:gourinandhana@cluster0-shard-00-00.6lz2v.mongodb.net:27017/health-manager-db?ssl=true&authSource=admin';


async function initDB() {
    try {
        console.log('Connecting to MongoDB via Standard String...');
        await mongoose.connect(SIMPLE_URI);
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
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

initDB();
