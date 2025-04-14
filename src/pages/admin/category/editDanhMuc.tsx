import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ICategory } from "../../../inface/category";
import { message } from "antd";
import { FaMobileAlt, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa";

const icons = {
  FaMobileAlt: <FaMobileAlt />,
  FaLaptop: <FaLaptop />,
  FaClock: <FaClock />,
  FaCamera: <FaCamera />,
  FaHeadphones: <FaHeadphones />,
  FaGamepad: <FaGamepad />,
};

function EditDanhMuc() {
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<ICategory>();
  const params = useParams();
  const nav = useNavigate();

  const { data, isLoading } = useQuery<ICategory>({
    queryKey: ["category", params.id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/category/${params.id}`);
      reset(data);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: ICategory) => {
      await axios.put(`http://localhost:3000/category/${params.id}`, updatedData);
    },
    onSuccess: () => {
      message.success("Cập nhật danh mục thành công!");
      nav("/admin/listDanhMuc");
    },
  });

  const onSubmit = (data: ICategory) => mutation.mutate(data);
  const selectedIcon = watch("icon");

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Cập nhật danh mục</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Tên danh mục</label>
            <input
              type="text"
              {...register("name", { required: "Tên danh mục không được để trống" })}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Mô tả</label>
            <textarea
              {...register("description", { required: "Mô tả không được để trống" })}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Chọn Icon</label>
            <select
              {...register("icon", { required: "Vui lòng chọn một icon" })}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Chọn icon --</option>
              {Object.keys(icons).map(iconKey => (
                <option key={iconKey} value={iconKey}>{iconKey}</option>
              ))}
            </select>
            {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>}
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Icon đã chọn:</label>
            <div className="text-2xl text-blue-500">
              {icons[selectedIcon as keyof typeof icons]}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
            >
              Cập nhật danh mục
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditDanhMuc;
