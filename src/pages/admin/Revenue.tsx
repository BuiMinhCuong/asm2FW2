import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
    id: number;
    date: string;
    total: number;
}

const Revenue = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:3000/orders");
                const data: Order[] = res.data;

                // Tính tổng doanh thu
                const total = data.reduce((sum, order) => sum + order.total, 0);

                setOrders(data);
                setTotalRevenue(total);
                setError(null); // Xóa lỗi nếu có
            } catch (error) {
                console.error("Lỗi khi tải đơn hàng:", error);
                setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center text-indigo-600">
                Thống kê doanh thu
            </h1>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500 text-lg">{error}</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                            Tổng doanh thu:{" "}
                            <span className="text-green-600">
                                ${totalRevenue.toFixed(2)}
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        Đơn hàng ID: {order.id}
                                    </h3>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Ngày:</span>{" "}
                                        {new Date(order.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Tổng tiền:</span>{" "}
                                        <span className="text-green-600">
                                            ${order.total.toFixed(2)}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Revenue;