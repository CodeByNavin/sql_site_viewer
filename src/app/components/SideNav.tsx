import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SideNav({
  selected,
  setSelected,
  tableData,
}: {
  selected: string;
  setSelected: (arg: string) => void;
  tableData: Record<string, any> | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="relative h-full">
      <motion.section
        layout
        initial={{ width: 256 }}
        animate={{ width: isOpen ? 256 : 64 }}
        transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
        className="shadow-sm shadow-foreground bg-zinc-900/40 text-white h-full p-4 overflow-hidden"
      >
        <div className="flex flex-row justify-between items-start">
          {isOpen && <h2 className="text-lg font-semibold mb-4">Tables</h2>}
        </div>

        {tableData === null ? (
          <p className="text-gray-500">Loading...</p>
        ) : Object.keys(tableData).length > 0 ? (
          <motion.ul className="space-y-1" layout>
            {Object.keys(tableData).map((tableName) => (
              <motion.li
                key={tableName}
                onClick={() => setSelected(tableName)}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-3 py-2 rounded cursor-pointer ${
                  selected === tableName
                    ? "bg-foreground/50"
                    : "hover:bg-foreground/35"
                } flex items-center`}
              >
                {!isOpen && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 pointer-events-none">
                    {tableName}
                  </span>
                )}

                <motion.span
                  className="origin-left inline-block"
                  style={{ transformOrigin: "left" }}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    scaleX: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tableName}
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-gray-500">No tables available</p>
        )}
      </motion.section>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-3 top-4 bg-zinc-800 p-1 rounded-full shadow-md hover:bg-zinc-700 transition"
      >
        <ChevronLeftIcon
          className={`size-5 text-white transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </motion.button>
    </div>
  );
}
