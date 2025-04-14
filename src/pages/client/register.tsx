import { useForm } from "react-hook-form";
import { User } from "../../inface/user";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  const nav = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: User) => {
      try {
        const res = await axios.post(`http://localhost:3000/register`, {
          ...data,
          role: "user",
        });
        return res.data;
      } catch (error) {
        console.error("Registration error:", error);
        throw new Error("Registration failed");
      }
    },
    onSuccess: () => {
      alert("Registration successful");
      nav("/login");
    },
    onError: () => {
      alert("Registration failed. Please try again.");
    },
  });

  const onRegister = (data: User) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/src/assets/bande.jpg"
          alt="Shopping"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2">Create an Account</h1>
          <p className="text-gray-600 mb-8">Enter your details below</p>

          <form onSubmit={handleSubmit(onRegister)} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email or Phone Number"
                className="w-full p-3 border-b border-gray-300 focus:border-black focus:outline-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border-b border-gray-300 focus:border-black focus:outline-none"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
              type="submit"
              className="bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600 transition-colors"
            >
              Create Account
            </button>
            <a href="/login" className="text-red-500 hover:text-red-600">
              Already have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default Register;