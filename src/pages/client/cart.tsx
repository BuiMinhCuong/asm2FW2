import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useState } from "react";

const CartClient = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        paymentMethod: "cash",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống. Không thể thanh toán.");
            return;
        }

        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            alert("Vui lòng nhập đầy đủ thông tin trước khi thanh toán.");
            return;
        }

        try {
            const orderData = {
                customer: customerInfo,
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
                date: new Date().toISOString(),
            };

            const res = await axios.post("http://localhost:3000/orders", orderData);
            alert("Thanh toán thành công!");
            console.log("Order response:", res.data);

            clearCart();
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            alert("Thanh toán thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold mb-8 text-center text-green-600">Giỏ hàng của bạn</h1>
            {cart.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">Giỏ hàng của bạn đang trống.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cart.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                            <p className="text-gray-600">Giá: ${item.price}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                        }
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <p className="px-4">{item.quantity}</p>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {cart.length > 0 && (
                <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin khách hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Tên khách hàng:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={customerInfo.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập tên của bạn"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Số điện thoại:
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={customerInfo.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-2">
                                Địa chỉ:
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={customerInfo.address}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập địa chỉ giao hàng"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-2">
                                Phương thức thanh toán:
                            </label>
                            <select
                                name="paymentMethod"
                                value={customerInfo.paymentMethod}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="cash">Tiền mặt</option>
                                <option value="credit">Thẻ tín dụng</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-right text-gray-800 mt-6">
                        Tổng tiền: $
                        {cart
                            .reduce((total, item) => total + item.price * item.quantity, 0)
                            .toFixed(2)}
                    </h2>
                    <button
                        onClick={handleCheckout}
                        className="mt-6 w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg hover:from-green-500 hover:to-green-700 transition"
                    >
                        Thanh toán
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartClient;