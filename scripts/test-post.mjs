import dbConnect from '../src/lib/db.js';
import Patient from '../src/models/Patient.js';

async function testPost() {
    try {
        console.log('Testing DB Connect...');
        await dbConnect();
        console.log('DB Connected.');

        const body = {
            name: 'Script Test User',
            age: 25,
            condition: 'Testing Logic',
            status: 'Stable',
            lastVisit: '2025-01-01'
        };

        console.log('Creating Patient:', body);
        const patient = await Patient.create(body);
        console.log('Patient created:', patient);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

testPost();
