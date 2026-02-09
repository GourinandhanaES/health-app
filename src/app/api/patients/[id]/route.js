import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: patient });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        console.log(`[DEBUG] Attempting update for patient ID: ${id}`);

        const body = await request.json();
        console.log('[DEBUG] Received Update Payload:', JSON.stringify(body, null, 2));

        const patient = await Patient.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!patient) {
            console.log(`[DEBUG] No patient found with ID: ${id}`);
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        console.log(`[DEBUG] Successfully updated patient: ${patient.name}`);
        return NextResponse.json({ success: true, data: patient });
    } catch (error) {
        console.error('[DEBUG] Update Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        console.log(`API: DELETE /api/patients/${id}`);

        const deletedPatient = await Patient.findOneAndDelete({ _id: id });

        if (!deletedPatient) {
            console.log('API: Patient not found for deletion');
            return NextResponse.json({ success: false }, { status: 404 });
        }

        console.log('API: Patient deleted');
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        console.error('API: Error in DELETE:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
