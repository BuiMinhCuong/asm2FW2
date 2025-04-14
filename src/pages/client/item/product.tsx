import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { IProduct } from "../../../inface/product";
import { useCart } from "../../../context/CartContext";

type Props = {
  products: IProduct;
};

const ItemProduct = ({ products }: Props) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(products);
    alert(`Đã thêm sản phẩm "${products.name}" vào giỏ hàng!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden text-center group">
      {/* Image and Hover Actions */}
      <div className="relative bg-gray-100 flex items-center justify-center h-[250px]">
        <Link to={`/detail/${products.id}`} className="block w-full h-full">
          <img
            src={products.image}
            alt={products.name}
            className="object-contain w-full h-full p-4"
          />
        </Link>

        {/* Hover Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100">
            <AiOutlineHeart size={16} />
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100">
            <AiOutlineEye size={16} />
          </button>
        </div>

        {/* Hover Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 w-full bg-black text-white py-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Add To Cart
        </button>
      </div>

      {/* Product Name */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800">{products.name}</h3>
      </div>
    </div>
  );
};

export default ItemProduct;
