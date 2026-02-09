'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Phone, Mail, Calendar, Plus, X, Edit, Trash2, Save } from 'lucide-react';

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [ageFilter, setAgeFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        bloodType: 'O+',
        phone: '',
        address: '',    
        condition: '',
        status: 'Stable',
        admissionDate: new Date().toISOString().split('T')[0],
        attendingDoctor: '',
        roomNumber: '',
        treatmentStage: 'Diagnosis',
        currentMedications: [],
        medications_raw: '',
        emergencyContact: { name: '', relation: '', phone: '' },
        dischargePlan: { estimatedDate: '', instructions: '', followUpRequired: false },
        lastVisit: new Date().toISOString().split('T')[0],
        allergies: '',
    });


    const router = useRouter();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const res = await fetch('/api/patients', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
            setPatients(data.data);
        }
    };

    const openModal = (patient = null) => {
        if (patient) {
            setCurrentPatient(patient);
            setFormData({
                ...patient,
                allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '',
                emergencyContact: patient.emergencyContact || { name: '', relation: '', phone: '' },
                dischargePlan: patient.dischargePlan || { estimatedDate: '', instructions: '', followUpRequired: false }
            });
        } else {
            setCurrentPatient(null);
            setFormData({
                name: '',
                age: '',
                gender: 'Male',
                bloodType: 'O+',
                phone: '',
                address: '',
                condition: '',
                status: 'Stable',
                admissionDate: new Date().toISOString().split('T')[0],
                attendingDoctor: '',
                roomNumber: '',
                treatmentStage: 'Diagnosis',
                emergencyContact: { name: '', relation: '', phone: '' },
                dischargePlan: { estimatedDate: '', instructions: '', followUpRequired: false },
                lastVisit: new Date().toISOString().split('T')[0],
                allergies: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = currentPatient ? 'PUT' : 'POST';
        const url = currentPatient ? `/api/patients/${currentPatient._id}` : '/api/patients';

        // Prepare data (sanitize and process arrays)
        const sanitize = (obj) => {
            const clean = { ...obj };
            delete clean._id;
            delete clean.createdAt;
            delete clean.updatedAt;
            delete clean.__v;

            // Nested sanitization
            if (clean.emergencyContact) {
                delete clean.emergencyContact._id;
            }
            if (clean.dischargePlan) {
                delete clean.dischargePlan._id;
            }
            return clean;
        };

        const dataToProcess = sanitize(formData);
        const processedData = {
            ...dataToProcess,
            lastVisit: new Date().toISOString().split('T')[0],
            allergies: typeof formData.allergies === 'string'
                ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean)
                : formData.allergies,

            currentMedications: formData.medications_raw
                ? formData.medications_raw.split(',').map(item => {
                    const [name, dosage, frequency] = item.split(':').map(s => s.trim());
                    return { name, dosage, frequency };
                })
                : []
        };


        console.log("Submitting Data:", processedData);

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processedData),
        });

        if (res.ok) {
            fetchPatients();
            setIsModalOpen(false);
            alert(currentPatient ? "Updated successfully!" : "Added successfully!");
        } else {
            const err = await res.json();
            console.error("Submission Error:", err);
            alert("Error: " + (err.error || "Failed to save"));
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this patient?')) {
            const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
            if (res.ok) fetchPatients();
        }
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.condition.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;

        let matchesAge = true;
        if (ageFilter === '<20') matchesAge = patient.age < 20;
        else if (ageFilter === '<30') matchesAge = patient.age < 30;
        else if (ageFilter === '<50') matchesAge = patient.age < 50;
        else if (ageFilter === '>50') matchesAge = patient.age >= 50;

        return matchesSearch && matchesStatus && matchesAge;
    });

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Patients</h1>
                    <p className="text-zinc-400">Manage and view patient records.</p>
                </div>
                <Button onClick={() => openModal()}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Patient
                </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 uppercase font-bold">Status:</span>
                        <select
                            className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Sick">Sick</option>
                            <option value="Critical">Critical</option>
                            <option value="Stable">Stable</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 uppercase font-bold">Age:</span>
                        <select
                            className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={ageFilter}
                            onChange={(e) => setAgeFilter(e.target.value)}
                        >
                            <option value="All">All Ages</option>
                            <option value="<20">Under 20</option>
                            <option value="<30">Under 30</option>
                            <option value="<50">Under 50</option>
                            <option value=">50">50 & Over</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPatients.map((patient) => (
                    <PatientCard
                        key={patient._id}
                        patient={patient}
                        onEdit={(e) => {
                            e.stopPropagation();
                            openModal(patient);
                        }}
                        onDelete={(e) => handleDelete(patient._id, e)}
                    />
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl my-8">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">{currentPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Full Name" name="name" value={formData.name} onChange={handleFormChange} required />
                                <Input label="Age" name="age" type="number" value={formData.age} onChange={handleFormChange} required />
                                <Select label="Gender" name="gender" value={formData.gender} onChange={handleFormChange} options={['Male', 'Female', 'Other']} />
                                <Select label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleFormChange} options={['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']} />
                                <Input label="Phone" name="phone" value={formData.phone} onChange={handleFormChange} />
                                <Input label="Address" name="address" value={formData.address} onChange={handleFormChange} />
                                <Input label="Condition" name="condition" value={formData.condition} onChange={handleFormChange} required />
                                <Select label="Status" name="status" value={formData.status} onChange={handleFormChange} options={['Stable', 'Critical', 'Sick', 'Healthy']} />
                                <Input label="Room No" name="roomNumber" value={formData.roomNumber} onChange={handleFormChange} />
                                <Input label="Doctor" name="attendingDoctor" value={formData.attendingDoctor} onChange={handleFormChange} />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <Input
                                    label="Medications (e.g. Med1: 500mg: Daily, Med2: 250mg: Twice)"
                                    name="medications_raw"
                                    value={formData.medications_raw || ''}
                                    onChange={handleFormChange}
                                    placeholder="Format: Name: Dosage: Frequency, ..."
                                />
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-zinc-500">Allergies (comma separated)</label>
                                    <input
                                        name="allergies"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.allergies}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500">
                                <Save className="mr-2 h-4 w-4" /> Save Patient
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PatientCard({ patient, onEdit, onDelete }) {
    const statusColors = {
        Healthy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        Sick: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        Stable: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    const router = useRouter();

    return (
        <Card
            className="flex flex-col gap-4 hover:border-blue-500/30 group relative cursor-pointer min-h-[180px]"
            onClick={() => router.push(`/patients/${patient._id}`)}
        >
            <div className="absolute top-4 right-4 flex gap-2 z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(e);
                    }}
                    className="h-8 w-8 bg-zinc-800 text-white hover:bg-blue-600 border border-zinc-700 shadow-md p-0"
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e);
                    }}
                    className="h-8 w-8 bg-zinc-800/50 text-red-400 hover:bg-red-500/10 hover:text-red-400 border border-zinc-700 p-0"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center gap-3">
                <div>
                    <h3 className="font-semibold text-white">{patient.name}</h3>
                    <p className="text-sm text-zinc-400">{patient.condition}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {patient.age} yrs</div>
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {patient.lastVisit}</div>
            </div>
            <div className="flex items-center justify-between mt-auto">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[patient.status]}`}>
                    {patient.status}
                </span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-7 w-7 p-0" onClick={() => { }}><Edit className="h-3 w-3" /></Button>
                    <Button variant="ghost" className="h-7 w-7 p-0" onClick={() => { }}><Trash2 className="h-3 w-3" /></Button>
                </div>
            </div>
        </Card>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">{label}</label>
            <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" {...props} />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">{label}</label>
            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" {...props}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}
