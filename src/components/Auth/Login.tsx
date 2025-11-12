import { zodResolver } from "@hookform/resolvers/zod";
import React from 'react';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { useAuth } from '../../contexts/AuthProvider';

const userFormSchema = z.object({
  email: z.string().min(1, { message: 'Endereço de email é obrigatório' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
});

type Schema = z.infer<typeof userFormSchema>;

export default function Login() {
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(userFormSchema)
  });

  const onSubmit = async (data: Schema) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error: any) => {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || "Ocorreu um erro.", {
      theme: "dark"
    });
  };

  return (
    <div className="flex min-h-screen flex-1 justify-center items-center bg-gray-950">
      <div className='bg-slate-900 rounded-lg p-8 max-w-md w-full '>
        <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
          Bem vindo!
        </h1>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">Email:</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && <span className="text-sm text-red-500 mt-1">{errors.email.message}</span>}
            </div>
            <div>
              <div className="flex justify-between items-center"> {/* Flex container for password label and forgot password link */}
                <label className="block text-sm font-medium leading-6 text-gray-200">Senha:</label>
                <a href="/forgot-password" className="text-sm font-medium leading-6 text-gray-200 forgot-password-link hover:text-blue-500">Esqueceu sua senha?</a>
              </div>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.password && <span className="text-sm text-red-500 mt-1">{errors.password.message}</span>}
            </div>
            <div>
              <button type="submit"
                className="flex mt-6 w-full justify-center rounded-md bg-indigo-600  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Logar
              </button>
            </div>
            <span className="block text-sm font-medium leading-6 text-gray-200">
              Não possui uma conta? <a href="/" className="text-blue-500 hover:text-white">Criar Nova Conta</a>
            </span>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
