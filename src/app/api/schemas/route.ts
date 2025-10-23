import { PrismaClient, Prisma } from "../../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {

        const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname = 'public';
        `;

        const tableData: { [key: string]: any } = {};

        if (!tables || tables.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: 'NO_TABLES_FOUND' }),
                { status: 400 }
            );
        }

        for (const table of tables) {
            const tableName = table.tablename;
            const quotedTableName = `"${tableName}"`;

            try {
                const rows = await prisma.$queryRaw`
                    SELECT * FROM ${Prisma.raw(quotedTableName)}
                `;

                tableData[tableName] = {
                    rows: rows
                };
            } catch (tableError) {
                console.error(`Error fetching data from table ${tableName}:`, tableError);
                tableData[tableName] = { error: 'Failed to fetch table data' };
            }
        }

        return new NextResponse(
            JSON.stringify({ data: tableData }),
            { status: 200 }
        );
    } catch (error) {
        console.log('API Error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' }),
            { status: 500 }
        );
    }
};

export async function DELETE(req: NextRequest) {
    const { table, data } = await req.json();

    if (!table || !data?.id) {
        return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), { status: 400 });
    }

    try {
        await prisma.$queryRaw(
            Prisma.sql`DELETE FROM ${Prisma.raw(`"${table}"`)} WHERE id = ${data.id}`
        );

        return new NextResponse(JSON.stringify({ status: true }), { status: 200 });
    } catch (error) {
        console.log('API Error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' }),
            { status: 500 }
        );
    }
};

export async function PUT(req: NextRequest) {
    const { table, data } = await req.json();

    if (!table || !data?.id) {
        return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), { status: 400 });
    }

    const fields = Object.keys(data).filter(k => k !== 'id');
    if (fields.length === 0) {
        return new NextResponse(JSON.stringify({ error: 'NO_FIELDS_TO_UPDATE' }), { status: 400 });
    }

    try {
        const assignments = fields.map(
            key => Prisma.sql`${Prisma.raw(`"${key}"`)} = ${data[key]}`
        );

        await prisma.$queryRaw(
            Prisma.sql`UPDATE ${Prisma.raw(`"${table}"`)} SET ${Prisma.join(assignments, ', ')} WHERE id = ${data.id}`
        );

        return new NextResponse(JSON.stringify({ status: true }), { status: 200 });
    } catch (error) {
        console.log('API Error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' }),
            { status: 500 }
        );
    }
};