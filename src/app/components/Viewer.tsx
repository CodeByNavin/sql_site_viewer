export default function TableViewer({
    selected,
    tableData
}: {
    selected: string;
    tableData: Record<string, any> | null;
}) {
    if (!tableData || !selected || !tableData[selected]) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p className="text-xl">Select a table to view data</p>
            </div>
        );
    }

    const data = tableData[selected].rows;

    if (!data || !data[0]) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p className="text-xl">No data available</p>
            </div>
        );
    }

    const columns = Object.keys(data[0]);

    return (
        <div className="p-6 ml-64 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{selected}</h2>
                <div className="text-sm text-white">Showing {data.length} records</div>
            </div>

            <div className="overflow-x-auto rounded-lg border-3 border-foreground shadow">
                <table className="min-w-full">
                    <thead className="bg-zinc-900 text-white">
                        <tr>
                            {columns.map(column => (
                                <th
                                    key={column}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className={rowIndex % 2 === 0 ? 'bg-foreground/50 text-white ' : 'bg-zinc-900 text-white'}
                            >
                                {columns.map(column => (
                                    <td
                                        key={`${rowIndex}-${column}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                    >
                                        {row[column] !== null ? String(row[column]) :
                                            <span>NULL</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}