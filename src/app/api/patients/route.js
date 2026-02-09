import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const patients = await Patient.find({});
        return NextResponse.json({ success: true, data: patients });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        console.log('API: Start POST /api/patients');
        console.log('API: Connecting to DB...');
        await dbConnect();
        console.log('API: DB Connected.');

        const body = await request.json();
        console.log('API: Received body:', body);

        const patient = await Patient.create(body);
        console.log('API: Patient created:', patient._id);

        return NextResponse.json({ success: true, data: patient.toObject() }, { status: 201 });
    } catch (error) {
        console.error('API: Error in POST /api/patients:', error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
