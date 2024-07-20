import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const colors = await prisma.color.findMany();
        const finishes = await prisma.finish.findMany();
        const materials = await prisma.material.findMany();
        const devices = await prisma.device.findMany();
        if (!colors || !finishes || !materials || !devices) {
            throw new Error('Data not found');

        }
        return NextResponse.json({
            colors,
            finishes,
            materials,
            devices,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching data' });
    }
};

