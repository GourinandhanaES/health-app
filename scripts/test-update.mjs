import dbConnect from '../src/lib/db.js';
import Patient from '../src/models/Patient.js';

async function testUpdate() {
    try {
        console.log('Testing DB Connect...');
        await dbConnect();
        console.log('DB Connected.');

        // 1. Create a dummy patient
        console.log('Creating dummy patient...');
        const patient = await Patient.create({
            name: 'Update Test User',
            age: 50,
            condition: 'Initial Condition',
            status: 'Stable',
            lastVisit: '2025-01-01',
            emergencyContact: { name: 'Old Contact', phone: '000', relation: 'Friend' }
        });
        console.log('Created:', patient._id);

        // 2. Define update payload
        const updatePayload = {
            name: "Update Test User MODIFIED",
            condition: "Updated Condition",
            emergencyContact: {
                name: "New Contact",
                phone: "111",
                relation: "Partner"
            },
            allergies: ["Peanuts"],
            dischargePlan: {
                estimatedDate: "2025-12-12",
                instructions: "Go home",
                followUpRequired: true
            }
        };

        // 3. Perform Update
        console.log('Updating patient...');
        const updated = await Patient.findByIdAndUpdate(patient._id, updatePayload, {
            new: true,
            runValidators: true
        });

        console.log('Updated Patient:', JSON.stringify(updated.toObject(), null, 2));

        // 4. Cleanup
        await Patient.findByIdAndDelete(patient._id);
        console.log('Cleaned up.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

testUpdate();
