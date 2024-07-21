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
            await prisma.caseColor.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else if (visible === 'finishes') {
            await prisma.caseFinish.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else if (visible === 'materials') {
            await prisma.caseMaterial.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else if (visible === 'devices') {
            await prisma.phoneModel.deleteMany({
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