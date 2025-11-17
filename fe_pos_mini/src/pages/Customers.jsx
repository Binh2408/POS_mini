import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const demo = [{ id: 1, name: "Nguyễn A", phone: "0977000111", points: 120 }];

export default function Customers() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Khách hàng</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              + Thêm khách
            </button>
          </div>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Tên</th>
                  <th className="p-3">SĐT</th>
                  <th className="p-3">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {demo.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 text-center">{c.phone}</td>
                    <td className="p-3 text-center">{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
