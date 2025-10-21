"use client";

import { useEffect, useState } from "react";
import SideNav from "./components/SideNav";
import TableViewer from "./components/Viewer";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [nextFetch, setNextFetch] = useState<number>(30);
  const [nextFetchTime, setNextFetchTime] = useState<number | null>(null);
  
  const [tableData, setTableData] = useState<any>(null);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (nextFetchTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, nextFetchTime - now);

        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextFetchTime]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schemas', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch schema data');
        return;
      }

      const data = await response.json();
      setTableData(data.data);

      setNextFetchTime(Date.now() + (nextFetch * 1000));
    } catch (err) {
      setError('Error connecting to database');
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
    <main className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">SQL Database Explorer</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
          <div className="text-sm text-gray-500">
            Auto-refresh every {nextFetch} seconds
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {tableData && (
        <section>
          <SideNav
            selected={selected}
            setSelected={setSelected}
            tableData={tableData}
          />
          {selected && (
            <TableViewer
              selected={selected}
              tableData={tableData}
            />
          )}
        </section>
      )}
    </main>
  );
}