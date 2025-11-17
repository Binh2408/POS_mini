import React from "react";
export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold mt-2">{value}</div>
    </div>
  );
}
