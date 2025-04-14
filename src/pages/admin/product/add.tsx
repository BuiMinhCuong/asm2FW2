import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../../inface/product";
import { createData, ListData } from "../../../services/data";
import { ICategory } from "../../../inface/category";
import { message } from "antd";
import { useState } from "react";
import axios from "axios";

function AddP() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IProduct>();
  const nav = useNavigate();

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: async () => (await ListData("category")).data,
  });

  const mutation = useMutation({
    mutationFn: async (data: IProduct) => (await createData<IProduct>({ route: "products", data })).data,
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công");
      nav("/admin/list");
    },
  });

  const onSubmit = (data: IProduct) => mutation.mutate(data);

  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const upLoadImage = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file[0]);
    formData.append("upload_preset", "asm_fe2");
    try {
      const { data } = await axios.post("https://api.cloudinary.com/v1_1/dy0gx6iz7/image/upload", formData);
      reset({ image: data.url });
      setImage(data.url);
      setLoading(false);
    } catch (error) {
      message.error("Lỗi tải ảnh");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-medium text-gray-700">Tên sản phẩm</label>
          <input
            type="text"
            {...register("name", { required: "Tên sản phẩm không được để trống" })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Danh mục</label>
          <select
            {...register("category", { required: "Vui lòng chọn danh mục" })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Chọn danh mục</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Hình ảnh</label>
          <input type="file" onChange={(e) => upLoadImage(e.target.files)} className="w-full" />
          {loading && <p className="text-gray-500 text-sm">Đang tải ảnh...</p>}
          {image && <img src={image} alt="Uploaded" className="mt-3 w-32 h-32 object-cover rounded" />}
          <input type="hidden" {...register("image", { required: "Hình ảnh không được để trống" })} />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Giá</label>
          <input
            type="number"
            {...register("price", { required: true, min: { value: 0, message: "Giá phải lớn hơn 0" } })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Màu sắc</label>
          <input type="color" {...register("color", { required: true })} className="w-full h-12 rounded" />
          {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Kích thước</label>
          <select
            {...register("size", { required: true })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Chọn size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Đánh giá (0 - 5)</label>
          <input
            type="number"
            {...register("rating", {
              required: true,
              min: { value: 0, message: "Tối thiểu là 0" },
              max: { value: 5, message: "Tối đa là 5" },
            })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Số lượng</label>
          <input
            type="number"
            {...register("quantity", { required: true, min: { value: 0, message: "Không được âm" } })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-gray-700">Mô tả</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Trạng thái</label>
          <select
            {...register("status", { required: true })}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Chọn trạng thái</option>
            <option value="inStock">Còn hàng</option>
            <option value="offStock">Hết hàng</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddP;