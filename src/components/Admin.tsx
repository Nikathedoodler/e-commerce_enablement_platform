"use client";
import React from "react";
import { useState } from "react";

const Admin = () => {
  const [activeSection, setActiveSection] = React.useState("users");

  type User = {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "User";
  };

  // Mock user data
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "User",
  });

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // User form handlers
  const openAddModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "User" });
    setShowModal(true);
  };
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...editingUser, ...form } : u
        )
      );
    } else {
      setUsers([...users, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div
      id="#dahsboard"
      className="w-full lg:w-3/4 mx-auto flex flex-col justify-center items-center border-2 space-y-6 py-10 px-12 scroll-mt-10"
    >
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleSectionChange("users")}
          className={`${
            activeSection === "users" ? "bg-black" : "bg-blue-500"
          }  rounded-4xl px-4 py-2 text-white cursor-pointer`}
        >
          Users
        </button>
        <button
          onClick={() => handleSectionChange("usages")}
          className={`${
            activeSection === "usages" ? "bg-black" : "bg-blue-500"
          }  rounded-4xl px-4 py-2 text-white cursor-pointer`}
        >
          Usages
        </button>
        <button
          onClick={() => handleSectionChange("uploads")}
          className={`${
            activeSection === "uploads" ? "bg-black" : "bg-blue-500"
          }  rounded-4xl px-4 py-2 text-white cursor-pointer`}
        >
          Uploads
        </button>
      </div>
      {/* Section Content */}
      {activeSection === "users" && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Users</h2>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add User
            </button>
          </div>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-black"
                >
                  ✕
                </button>
                <h3 className="text-lg font-bold mb-4">
                  {editingUser ? "Edit User" : "Add User"}
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Name"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    {editingUser ? "Save Changes" : "Add User"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      {activeSection === "usages" && <div>Usages Section</div>}
      {activeSection === "uploads" && <div>Uploads Section</div>}
      {/* Footer */}
    </div>
  );
};

export default Admin;
