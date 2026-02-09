'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, User, Calendar, Activity, Phone, MapPin, AlertCircle, FileText, Pill, Stethoscope, BedDouble, CheckCircle, X, Save } from 'lucide-react';

export default function PatientDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchPatient(params.id);
        }
    }, [params.id]);

    const fetchPatient = async (id) => {
        try {
            const response = await fetch(`/api/patients/${id}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPatient(data.data);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sanitizeData = (data) => {
        if (Array.isArray(data)) {
            return data.map(item => sanitizeData(item));
        }
        if (data !== null && typeof data === 'object') {
            const { _id, createdAt, updatedAt, __v, ...rest } = data;
            const cleanRest = {};
            for (const key in rest) {
                cleanRest[key] = sanitizeData(rest[key]);
            }
            return cleanRest;
        }
        return data;
    };

    const handleUpdate = async (updatedData) => {
        try {
            const cleanData = sanitizeData(updatedData);

            const res = await fetch(`/api/patients/${patient._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData),
            });
            const data = await res.json();
            if (data.success) {
                setPatient(data.data);
                setIsEditing(false);
                alert("Patient updated successfully!");
            } else {
                console.error("Update failed:", data.error);
                alert("Failed to update: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Failed to update patient", error);
            alert("Error updating patient");
        }
    };

    if (loading) return <div className="text-white p-10">Loading details...</div>;
    if (!patient) return <div className="text-white p-10">Patient not found</div>;
    console.log("UPDATED PATIENT FROM DB:", patient);


    return (
        <div className="space-y-8 pb-10 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button variant="ghost" onClick={() => router.back()} className="w-fit text-zinc-400 hover:text-white pl-0 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                       
                        <div>
                            <h1 className="text-3xl font-bold text-white">{patient.name}</h1>
                            <div className="flex items-center gap-2 text-zinc-400">
                                {/* <span>ID: {patient._id?.substring(0, 8)}...</span> */}
                                <span>•</span>
                                <span>{patient.age} yrs</span>
                                <span>•</span>
                                <span>{patient.gender || 'Male'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${patient.status === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            patient.status === 'Sick' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                            {patient.status}
                        </div>
                        <Button
                            variant="outline"
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Record
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Personal Info */}
                <div className="space-y-6">
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-400" /> Personal Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <InfoRow label="Gender" value={patient.gender || 'N/A'} />
                            <InfoRow label="Blood Type" value={patient.bloodType || 'N/A'} />
                            <InfoRow label="Contact" value={patient.phone?.trim() || 'NIL'} />
                            <InfoRow label="Address" value={patient.address || 'N/A'} />
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Phone className="h-5 w-5 text-rose-400" /> Emergency Contact
                        </h3>
                        <div className="space-y-3 text-sm">
                            <InfoRow label="Name" value={patient.emergencyContact?.name || 'N/A'} />
                            <InfoRow label="Relation" value={patient.emergencyContact?.relation || 'N/A'} />
                            <InfoRow label="Phone" value={patient.emergencyContact?.phone || 'N/A'} />
                        </div>
                    </Card>
                </div>

                {/* Middle Column: Clinical Info */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Treatment Timeline */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-amber-400" /> Treatment Journey
                        </h3>
                        <div className="relative flex justify-between items-center w-full px-4">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -z-0 -translate-y-1/2 rounded-full"></div>
                            {['Diagnosis', 'Treatment', 'Recovery', 'Discharge'].map((stage, i) => {
                                const currentStageIndex = ['Diagnosis', 'Treatment', 'Recovery', 'Discharge Planning'].indexOf(patient.treatmentStage || 'Diagnosis');
                                const isCompleted = i <= currentStageIndex;
                                const isCurrent = i === currentStageIndex;

                                return (
                                    <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full border-4 ${isCompleted ? 'bg-blue-500 border-blue-900' : 'bg-zinc-800 border-zinc-900'
                                            } ${isCurrent ? 'ring-4 ring-blue-500/20 scale-125' : ''}`}></div>
                                        <span className={`text-xs font-medium ${isCompleted ? 'text-blue-400' : 'text-zinc-600'}`}>{stage}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* medications */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Pill className="h-5 w-5 text-pink-400" /> Current Medications
                        </h3>

                        {patient.currentMedications?.length > 0 ? (
                            <div className="space-y-3">
                            {patient.currentMedications.map((med, index) => (
                                <div
                                key={index}
                                className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20"
                                >
                                <p className="text-sm text-white font-medium">{med.name}</p>
                                <p className="text-xs text-zinc-400">
                                    {med.dosage} • {med.frequency}
                                </p>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-400">No current medications prescribed.</p>
                        )}
                    </Card>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <BedDouble className="h-5 w-5 text-purple-400" /> Admission Info
                            </h3>
                            <div className="space-y-3 text-sm">
                                <InfoRow label="Admitted" value={patient.admissionDate || 'N/A'} />
                                <InfoRow label="Room No" value={patient.roomNumber || 'N/A'} />
                                <InfoRow label="Doctor" value={patient.attendingDoctor || 'N/A'} />
                            </div>
                        </Card>

                        <Card className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-emerald-400" /> Diagnosis
                            </h3>
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-sm text-emerald-100">{patient.condition}</p>
                            </div>
                            <div>
                                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Allergies</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(patient.allergies?.length > 0 ? patient.allergies : ['None']).map(algo => (
                                        <span key={algo} className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">{algo}</span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-6 space-y-4 border-l-4 border-l-blue-500">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-400" /> Discharge Plan
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-zinc-400">Est. Discharge:</span>
                                <div className="text-white font-medium">{patient.dischargePlan?.estimatedDate || 'TBD'}</div>
                            </div>
                            <div>
                                <span className="text-zinc-400">Follow-up:</span>
                                <div className="text-white font-medium">{patient.dischargePlan?.followUpRequired ? 'Required' : 'Not Required'}</div>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <EditPatientModal
                    patient={patient}
                    onClose={() => setIsEditing(false)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
            <span className="text-zinc-400">{label}</span>
            <span className="text-zinc-200 font-medium text-right">{value}</span>
        </div>
    );
}

function EditPatientModal({ patient, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: patient.name || '',
        age: patient.age || '',
        gender: patient.gender || 'Male',
        bloodType: patient.bloodType || 'O+',
        phone: patient.phone || '',
        address: patient.address || '',
        condition: patient.condition || '',
        status: patient.status || 'Stable',
        admissionDate: patient.admissionDate || '',
        attendingDoctor: patient.attendingDoctor || '',
        roomNumber: patient.roomNumber || '',
        treatmentStage: patient.treatmentStage || 'Diagnosis',
        currentMedications: patient.currentMedications || [],
        medications_raw: patient.currentMedications?.map(m => `${m.name}: ${m.dosage}: ${m.frequency}`).join(', ') || '',
        emergencyContact: patient.emergencyContact || { name: '', relation: '', phone: '' },
        dischargePlan: patient.dischargePlan || { estimatedDate: '', instructions: '', followUpRequired: false },
        allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert allergies string back to array
        const processedData = {
            ...formData,
            allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
            currentMedications: formData.medications_raw
            ? formData.medications_raw.split(',').map(item => {
                const [name, dosage, frequency] = item.split(':').map(s => s.trim());
                return { name, dosage, frequency };
            })
            : []
        };
        onSave(processedData);
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl my-8">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white">Edit Patient Record</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
                            <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                            <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
                            <Select label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Medical Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Medical Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Condition" name="condition" value={formData.condition} onChange={handleChange} required />
                            <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['Stable', 'Critical', 'Sick', 'Healthy']} />
                            <Input label="Admitted Date" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} />
                            <Input label="Attending Doctor" name="attendingDoctor" value={formData.attendingDoctor} onChange={handleChange} />
                            <Input label="Room Number" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
                            <Select label="Treatment Stage" name="treatmentStage" value={formData.treatmentStage} onChange={handleChange} options={['Diagnosis', 'Treatment', 'Recovery', 'Discharge Planning']} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-400">Allergies (comma separated)</label>
                            <input
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-400">
                                Medications (Format: Name: Dosage: Frequency, ...)
                            </label>
                            <input
                                value={formData.medications_raw}
                                onChange={(e) => setFormData(prev => ({ ...prev, medications_raw: e.target.value }))}
                                className="w-full rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Emergency Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Emergency Contact</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Name"
                                value={formData.emergencyContact.name}
                                onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                            />
                            <Input
                                label="Relation"
                                value={formData.emergencyContact.relation}
                                onChange={(e) => handleNestedChange('emergencyContact', 'relation', e.target.value)}
                            />
                            <Input
                                label="Phone"
                                value={formData.emergencyContact.phone}
                                onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Discharge Plan */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Discharge Plan</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Est. Date"
                                type="date"
                                value={formData.dischargePlan.estimatedDate}
                                onChange={(e) => handleNestedChange('dischargePlan', 'estimatedDate', e.target.value)}
                            />
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-zinc-400">Instructions</label>
                                <textarea
                                    className="w-full rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    rows={2}
                                    value={formData.dischargePlan.instructions}
                                    onChange={(e) => handleNestedChange('dischargePlan', 'instructions', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                </form>

                <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500 text-white">
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">{label}</label>
            <input
                className="w-full rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                {...props}
            />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">{label}</label>
            <select
                className="w-full rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                {...props}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
