export default function SideNav({
    selected,
    setSelected,
    tableData
}: {
    selected: string;
    setSelected: (arg: string) => void;
    tableData: Record<string, any> | null;
}) {

    return (
        <section className="absolute left-0 top-0 w-64 shadow-sm shadow-foreground bg-zinc-900/40 text-white h-screen p-4">
            <h2 className="text-lg font-semibold mb-4">Tables</h2>
            {tableData && Object.keys(tableData).length > 0 ? (
                <ul className="space-y-1">
                    {Object.keys(tableData).map(tableName => (
                        <li
                            key={tableName}
                            onClick={() => setSelected(tableName)}
                            className={`px-3 py-2 rounded cursor-pointer ${selected === tableName ? "bg-foreground/50" : "hover:bg-foreground/35"
                                }`}
                        >
                            {tableName}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No tables available</p>
            )}
        </section>
    )
}