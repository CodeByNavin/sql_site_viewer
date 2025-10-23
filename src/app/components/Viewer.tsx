"use client";

import { PencilSquareIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function TableViewer({
    selected,
    tableData,
    setTableData,
}: {
    selected: string;
    tableData: Record<string, any> | null;
    setTableData: (data: any) => void;
}) {
    const [editData, setEditData] = useState<any>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!tableData || !selected || !tableData[selected]) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p className="text-xl">Select a table to view data</p>
            </div>
        );
    }

    const data = tableData[selected].rows;
    const columns = Object.keys(data?.[0] || {});

    const DeleteValue = async (rowData: any) => {
        if (!confirm("Are you sure you want to delete this record?")) return;

        try {
            setLoading(true);
            const response = await fetch("/api/schemas", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ table: selected, data: rowData }),
            });

            if (response.ok) {
                const newRows = data.filter((r: any) => r.id !== rowData.id);
                setTableData({
                    ...tableData,
                    [selected]: { ...tableData[selected], rows: newRows },
                });
            } else {
                setActionError("Failed to delete record");
            }
        } catch (error) {
            setActionError("Error deleting record");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch("/api/schemas", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ table: selected, data: editData }),
            });

            if (response.ok) {
                const updatedRows = data.map((row: any) =>
                    row.id === editData.id ? editData : row
                );
                setTableData({
                    ...tableData,
                    [selected]: { ...tableData[selected], rows: updatedRows },
                });
                setEditData(null);
            } else {
                setActionError("Failed to update record");
            }
        } catch (error) {
            setActionError("Error updating record");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 flex-1 overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{selected}</h2>
                <div className="text-sm text-white">Showing {data.length} records</div>
            </div>

            {actionError && (
                <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded">
                    {actionError}
                </div>
            )}

            <div className="w-full max-w-[95vw] overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-zinc-900 text-white">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase whitespace-nowrap"
                                >
                                    {column}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className={
                                    rowIndex % 2 === 0
                                        ? "bg-foreground/50 text-white"
                                        : "bg-zinc-900 text-white"
                                }
                            >
                                {columns.map((column) => (
                                    <td
                                        key={`${rowIndex}-${column}`}
                                        className="px-6 py-4 text-sm whitespace-nowrap"
                                    >
                                        {row[column] !== null ? String(row[column]) : <span>NULL</span>}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => DeleteValue(row)}
                                            className="cursor-pointer hover:text-red-500"
                                            disabled={loading}
                                        >
                                            <TrashIcon className="size-5" />
                                        </button>
                                        <button
                                            onClick={() => setEditData(row)}
                                            className="cursor-pointer hover:text-blue-500"
                                            disabled={loading}
                                        >
                                            <PencilSquareIcon className="size-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ...
        </div>
    );
}
