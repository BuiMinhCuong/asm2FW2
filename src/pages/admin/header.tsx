import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminHeader = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const nav = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            nav(`/admin/list?search=${searchTerm.trim()}`);
        }
    };

    return (
        <header className="bg-gray-800 text-white w-full px-6 py-3 shadow-lg flex items-center justify-between sticky top-0 z-50">
            {/* Left section - Logo */}
            <div className="flex items-center gap-3">
                <Link to="/admin" className="text-2xl font-extrabold tracking-wide text-white hover:text-gray-300 transition">
                    MinhCuong
                </Link>
                <span className="text-sm text-gray-400 hidden sm:inline">Quản lý hệ thống</span>
            </div>

           

            {/* Right section - User info and actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <FaUserCircle className="text-2xl text-blue-400" />
                    <span className="text-sm font-medium">Admin</span>
                </div>
                <Link
                    to="/logout"
                    className="text-gray-300 hover:text-red-400 transition duration-300 text-xl"
                    title="Đăng xuất"
                >
                    <FiLogOut />
                </Link>
            </div>
        </header>
    );
};

export default AdminHeader;
