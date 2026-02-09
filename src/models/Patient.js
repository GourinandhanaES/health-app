import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the patient.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'male', 'female', 'other'], default: 'Male' },
    bloodType: { type: String, default: 'O+' },
    phone:{type:String, default:''},
    address: { type: String, default: '' },
    emergencyContact: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        relation: { type: String, default: '' },
    },

    // Medical Status
    condition: { type: String, required: true },
    status: {
        type: String,
        enum: ['Healthy', 'Sick', 'Critical', 'Stable'],
        default: 'Stable',
    },
    allergies: { type: [String], default: [] },
    currentMedications: [{
        name: String,
        dosage: String,
        frequency: String,
    }],
    medicalHistory: { type: [String], default: [] },

    // Admission & Treatment
    admissionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    roomNumber: { type: String, default: '' },
    attendingDoctor: { type: String, default: 'Dr. Unassigned' },
    treatmentStage: {
        type: String,
        enum: ['Diagnosis', 'Treatment', 'Recovery', 'Observation', 'Discharge Planning'],
        default: 'Diagnosis',
    },
    treatmentNotes: { type: String, default: '' },

    // Discharge
    dischargePlan: {
        estimatedDate: String,
        instructions: String,
        followUpRequired: Boolean,
    },

    lastVisit: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
