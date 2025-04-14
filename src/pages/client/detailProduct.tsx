import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ListData } from "../../services/data";
import { IProduct } from "../../inface/product";
import { AiFillStar, AiOutlineHeart } from "react-icons/ai";
import { FaTruck, FaUndo } from "react-icons/fa";

const DetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div className="text-center mt-10 text-red-500">Mã sản phẩm không hợp lệ</div>;

  const { data: product, isLoading, isError } = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: async () => (await ListData(`products/${id}`)).data,
  });

  const { data: relatedProducts } = useQuery<IProduct[]>({
    queryKey: ["relatedProducts"],
    queryFn: async () => {
      const { data } = await ListData("products");
      return Array.isArray(data) ? data.filter((p) => p.id !== Number(id)) : [];
    },
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");

  if (isLoading) return <div className="text-center py-10 text-gray-500">Đang tải thông tin sản phẩm...</div>;
  if (isError || !product) return <div className="text-center py-10 text-red-600">Không tìm thấy sản phẩm</div>;

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {[product.image, product.image, product.image].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                  selectedImage === img ? "border-red-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded border"
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h1>
          <div className="flex items-center mb-3 text-sm text-gray-500">
            <AiFillStar className="text-yellow-500 mr-1" /> 4.9 (100 Reviews)
            <span className="ml-4 text-green-600 font-medium">In Stock</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-4">
            {product.price.toLocaleString("vi-VN")}₫
          </p>
          <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

          <div className="mb-4">
            <span className="block font-medium mb-1">Colours:</span>
            <div className="flex gap-2">
              <button className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md"></button>
              <button className="w-6 h-6 bg-gray-700 rounded-full border-2 border-white shadow-md"></button>
            </div>
          </div>

          <div className="mb-4">
            <span className="block font-medium mb-1">Size:</span>
            <div className="flex gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button key={size} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 py-1 bg-white">{quantity}</span>
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
            >
              Buy Now
            </button>
            <button className="p-3 border rounded-full">
              <AiOutlineHeart className="text-xl text-gray-600" />
            </button>
          </div>

          
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Related Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts?.slice(0, 4).map((rp) => (
            <Link
              key={rp.id}
              to={`/detail/${rp.id}`}
              className="relative block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img src={rp.image} alt={rp.name} className="w-full h-40 object-cover rounded-t" />
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-1">{rp.name}</h3>
                <p className="text-red-500 font-bold text-sm">{rp.price.toLocaleString("vi-VN")}₫</p>
              </div>
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">-30%</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
