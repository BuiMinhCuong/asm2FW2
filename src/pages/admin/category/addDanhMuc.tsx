import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createData } from "../../../services/data";
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

function AddDanhMuc() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ICategory>();

  const nav = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: ICategory) => (await createData<ICategory>({ route: "category", data })).data,
    onSuccess: () => {
      message.success("Thêm danh mục thành công!");
      nav("/admin/listDanhMuc");
    },
  });

  const onSubmit = (data: ICategory) => mutation.mutate(data);

  const selectedIcon = watch("icon");

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Thêm danh mục mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Tên danh mục</label>
          <input
            type="text"
            placeholder="Nhập tên danh mục"
            {...register("name", { required: "Tên danh mục không được để trống" })}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Mô tả</label>
          <textarea
            placeholder="Nhập mô tả danh mục"
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
            Thêm danh mục
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDanhMuc;
    