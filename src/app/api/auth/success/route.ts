import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    try {

        if (!user || user == null || !user.id)
            throw new Error("something went wrong with authentication" + user);

        let dbUser = await prisma.user.findUnique({
            where: { kindeId: user.id }
        });

        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    kindeId: user.id,
                    email: user.email ?? "" // Using nullish coalescing operator to provide a default empty string value
                }
            });
        }

        return NextResponse.redirect(process.env.SITE_URL as string || "http://localhost:3000");
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching data' });
    }
}