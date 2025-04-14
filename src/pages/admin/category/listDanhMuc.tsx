import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, Button, message, Popconfirm, Input, Empty, Spin } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { ListData } from "../../../services/data";
import { ICategory } from "../../../inface/category";
import { IProduct } from "../../../inface/product";
import { FaMobileAlt, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa";

const iconMap: { [key: string]: JSX.Element } = {
    FaMobileAlt: <FaMobileAlt className="text-blue-500 text-xl" />,
    FaLaptop: <FaLaptop className="text-blue-500 text-xl" />,
    FaClock: <FaClock className="text-blue-500 text-xl" />,
    FaCamera: <FaCamera className="text-blue-500 text-xl" />,
    FaHeadphones: <FaHeadphones className="text-blue-500 text-xl" />,
    FaGamepad: <FaGamepad className="text-blue-500 text-xl" />,
};

const ListDanhMuc = () => {
    const { data: categories, isLoading: isLoadingCategories } = useQuery<ICategory[]>({
        queryKey: ["category"],
        queryFn: async () => (await ListData("category")).data,
    });

    const { data: products, isLoading: isLoadingProducts } = useQuery<IProduct[]>({
        queryKey: ["products"],
        queryFn: async () => (await ListData("products")).data,
    });

    const nav = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => axios.delete(`http://localhost:3000/category/${id}`),
        onSuccess: () => {
            message.success("Xóa danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["category"] });
        },
    });

    const handleDelete = (id: number) => mutation.mutate(id);

    const columns = [
        {
            title: "Icon",
            dataIndex: "icon",
            key: "icon",
            render: (icon: string) => iconMap[icon] || <span className="text-red-400">N/A</span>,
            width: 80,
        },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            render: (name: string) => <strong className="text-lg">{name}</strong>,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Sản phẩm",
            key: "products",
            render: (_: any, record: ICategory) => {
                const categoryProducts = products?.filter(p => p.category === record.name) || [];

                if (!categoryProducts.length) return <Empty description="Không có sản phẩm" />;

                return (
                    <div className="grid grid-cols-2 gap-2">
                        {categoryProducts.map(p => (
                            <div key={p.id} className="border rounded p-2 shadow hover:shadow-lg transition">
                                <img src={p.image} alt={p.name} className="h-24 w-full object-cover rounded mb-2" />
                                <div className="text-sm font-semibold">{p.name}</div>
                                <div className="text-red-500 font-bold">{p.price.toLocaleString()} VND</div>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: ICategory) => (
                <div className="flex gap-2">
                    <Button
                        type="default"
                        onClick={() => nav(`/admin/editDanhMuc/${record.id}`)}
                        icon={<EditOutlined />}
                    />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa danh mục này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => nav("/admin/addDanhMuc")}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Thêm danh mục
                </Button>
            </div>

            <div className="mb-4">
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm kiếm danh mục..."
                    className="w-1/3 p-2"
                />
            </div>

            <div className="bg-white p-4 rounded shadow">
                {isLoadingCategories || isLoadingProducts ? (
                    <div className="text-center py-10">
                        <Spin size="large" />
                        <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <Table
                        dataSource={categories}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                )}
            </div>
        </div>
    );
};

export default ListDanhMuc;
    