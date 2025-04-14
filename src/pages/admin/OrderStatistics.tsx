import { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    items: OrderItem[];
    total: number;
    date: string;
}

interface ProductStatistics {
    productId: number;
    quantitySold: number;
    totalRevenue: number;
}

const OrderStatistics = () => {
    const [statistics, setStatistics] = useState<ProductStatistics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:3000/orders");
                const orders: Order[] = res.data;

                // Tính toán thống kê
                const statsMap: { [key: number]: ProductStatistics } = {};

                orders.forEach((order) => {
                    order.items.forEach((item) => {
                        if (!statsMap[item.productId]) {
                            statsMap[item.productId] = {
                                productId: item.productId,
                                quantitySold: 0,
                                totalRevenue: 0,
                            };
                        }
                        statsMap[item.productId].quantitySold += item.quantity;
                        statsMap[item.productId].totalRevenue += item.quantity * item.price;
                    });
                });

                setStatistics(Object.values(statsMap));
                setError(null); // Xóa lỗi nếu có
            } catch (error) {
                console.error("Lỗi khi tải đơn hàng:", error);
                setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
                Thống kê sản phẩm đã bán
            </h1>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500 text-lg">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {statistics.map((stat) => (
                            <div
                                key={stat.productId}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    Sản phẩm ID: {stat.productId}
                                </h2>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Số lượng đã bán:</span>{" "}
                                    {stat.quantitySold}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Tổng doanh thu:</span>{" "}
                                    ${stat.totalRevenue.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatistics;