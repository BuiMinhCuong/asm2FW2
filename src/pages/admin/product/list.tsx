import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, message, Popconfirm, Table, Tag, Rate, Input, Empty, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { IProduct } from '../../../inface/product';
import { ListData } from '../../../services/data';

const ProductList = () => {
    const { search } = useLocation();
    const searchTerm = new URLSearchParams(search).get("search") || "";

    const { data: products, isLoading } = useQuery<IProduct[]>({
        queryKey: ['products'],
        queryFn: async () => (await ListData('products')).data,
    });

    const nav = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => axios.delete(`http://localhost:3000/products/${id}`),
        onSuccess: () => {
            message.success('Xóa thành công');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const DeleteProduct = (id: number) => mutation.mutate(id);

    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => (
                <img src={image} alt="product" className="w-16 h-16 object-cover rounded-md border" />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <strong className="text-base">{name}</strong>,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (category: string) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <span className="font-semibold text-red-500">{price.toLocaleString()} VND</span>,
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => <Rate disabled defaultValue={rating} />,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size: string) => <Tag color="green">{size}</Tag>,
        },
        {
            title: 'Kho',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thao tác',
            key: 'id',
            dataIndex: 'id',
            render: (id: number) => (
                <div className="flex gap-2">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => nav(`/admin/edit/${id}`)}
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa sản phẩm này?"
                        onConfirm={() => DeleteProduct(id)}
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
                <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => nav('/admin/add')}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Thêm sản phẩm
                </Button>
            </div>

            <div className="mb-4">
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-1/3 p-2"
                    onChange={(e) => nav(`/admin/list?search=${e.target.value}`)}
                />
            </div>

            <div className="bg-white p-4 rounded shadow">
                {isLoading ? (
                    <div className="text-center py-10">
                        <Spin size="large" />
                        <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <Table
                        dataSource={filteredProducts}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductList;
