import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const prisma = new PrismaClient();

    try {
        const { ids, visible } = await request.json();
        console.log(ids, visible);
        if (!ids || !visible) {
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        if (visible === 'colors') {
            await prisma.color.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else if (visible === 'finishes') {
            await prisma.finish.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else if (visible === 'materials') {
            await prisma.material.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else if (visible === 'devices') {
            await prisma.device.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else {
            return NextResponse.json({ message: 'Invalid model specified' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error deleting data' }, { status: 500 });
    }
}