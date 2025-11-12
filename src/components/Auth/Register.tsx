import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeSlash } from 'phosphor-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import api from '../../server/api';

const userFormSchema = z.object({
  username: z.string().min(1, { message: 'Nome de usuário é obrigatório' }),
  email: z.string().min(1, { message: 'Endereço de email é obrigatório' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }).max(26, { message: 'A senha não deve ter mais de 26 caracteres' }),
  confirmPassword: z.string().min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres' }).trim(),
})
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type Schema = z.infer<typeof userFormSchema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(userFormSchema)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: Schema) => {
    try {
      const response = await api.post('/api/users', { username: data.username, email: data.email, password: data.password });
      toast.success(response.data.message, {
        theme: "dark"
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error: any) => {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Ocorreu um erro.', {
      theme: "dark"
    });
  };

  return (
    <div className="flex min-h-screen flex-1 justify-center items-center bg-gray-950">
      <div className='bg-slate-900 rounded-lg p-8 max-w-md w-full '>
        <h1 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
          Criar Nova Conta
        </h1>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">Nome:</label>
              <input id="username" {...register('username')}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-200">Email:</label>
              <input id="email"
                type="email"
                autoComplete="email" {...register('email')} className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">Senha:</label>
              <div className="relative">
                <input id="password"
                  type={showPassword ? "text" : "password"} {...register('password')}
                  className=" w-full rounded-md border-0 p-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlash size={20} weight="bold" />
                  ) : (
                    <Eye size={20} weight="bold" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">Confirmar senha:</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register('confirmPassword')}
                  className=" w-full rounded-md border-0 p-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? (
                    <EyeSlash size={20} weight="bold" />
                  ) : (
                    <Eye size={20} weight="bold" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <button
                type="submit"
                className="flex mt-6 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Cadastrar
              </button>
            </div>
            <span className="block text-sm font-medium leading-6 text-gray-200">
              Já possui login? <a href="/login" className="text-blue-500 hover:text-white">Entrar</a>
            </span>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}