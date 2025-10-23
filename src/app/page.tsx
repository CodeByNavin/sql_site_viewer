"use client";

import { useEffect, useState } from "react";
import SideNav from "./components/SideNav";
import TableViewer from "./components/Viewer";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [nextFetch, setNextFetch] = useState<number>(30);
  const [nextFetchTime, setNextFetchTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(nextFetch);

  const [tableData, setTableData] = useState<any>(null);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!nextFetchTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((nextFetchTime - Date.now()) / 1000));
      setRemainingTime(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextFetchTime]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/schemas", { method: "GET" });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch schema data");
        return;
      }

      const data = await response.json();
      setTableData(data.data);
      setNextFetchTime(Date.now() + nextFetch * 1000);
    } catch (err) {
      setError("Error connecting to database");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, nextFetch * 1000);

    return () => clearInterval(intervalId);
  }, [nextFetch]);

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <main className="flex h-screen overflow-hidden">
      <SideNav
        selected={selected}
        setSelected={setSelected}
        tableData={tableData}
      />

      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">SQL Database Explorer</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh Data"}
            </button>
            <div className="text-sm text-gray-500">
              Auto-refresh in {remainingTime}s
            </div>
          </div>
        </div>

        {error && (
          <div className="z-50 p-3 bg-red-100 border border-red-300 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-x-hidden">
          {tableData ? (
            selected ? (
              <TableViewer
                selected={selected}
                tableData={tableData}
                setTableData={setTableData}
              />
            ) : (
              <h1 className="text-center text-2xl text-white font-bold mt-20">
                Please select a table from the sidebar
              </h1>
            )
          ) : (
            <p className="text-center text-gray-400 mt-10">Loading database...</p>
          )}
        </div>
      </div>
    </main>
  );
}