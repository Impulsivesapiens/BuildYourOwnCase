import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

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
        console.log(colors);
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

export async function POST(request: NextRequest) {
    try {
        const { colors, finishes, materials, devices, visible } = await request.json();
        console.log(visible);
        if (colors && visible === 'colors') {
            console.log(colors);
            for (const color of colors) {
                await prisma.color.create({
                    data: {
                        label: color.label,
                        value: color.value,
                        tw: color.tailwindColor,
                    }
                })
            }
        }

        if (finishes) {
            console.log(finishes);
            for (const finish of finishes) {
                await prisma.finish.create(
                    { data: { label: finish.label, value: finish.value, description: finish.description, price: parseInt(finish.price) * 100 } })
            }
        }

        if (materials) {
            for (const material of materials) {
                await prisma.material.create({ data: { label: material.label, value: material.value, description: material.description, price: parseInt(material.price) * 100 } })
            }
        }

        if (devices) {
            for (const device of devices) {
                await prisma.device.create({ data: device })
            }


        }

        return NextResponse.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error });
    }
}
