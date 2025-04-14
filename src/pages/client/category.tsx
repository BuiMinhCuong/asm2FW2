import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { IProduct } from "../../inface/product";
import { ListData } from "../../services/data";
import ItemProduct from "./item/product";
import { Pagination } from "antd";

const Category = () => {
  const { name } = useParams<{ name: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: products = [], isLoading, isError } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: async () => (await ListData("products")).data,
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => (await ListData("categories")).data,
  });

  if (isLoading) return <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Lỗi khi tải sản phẩm</div>;

  const filteredProducts = name && name !== "all"
    ? products.filter((product) => product.category === name)
    : products;

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onPageChange = (page: number) => setCurrentPage(page);

  const menuCategories = [
    "Phones",
    "Cameras",
    "Headphones",
    "Gaming",
    "Laptop",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Danh mục sản phẩm</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/category/all"
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  name === "all" || !name ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                Tất cả sản phẩm
              </Link>
            </li>
            {menuCategories.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/category/${cat}`}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    name === cat ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product List */}
        <main className="md:col-span-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {name === "all" || !name ? "Tất cả sản phẩm" : `Danh mục: ${name}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ItemProduct key={product.id} products={product} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={filteredProducts.length}
              pageSize={itemsPerPage}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Category;
