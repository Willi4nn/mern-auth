import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";
import api from "../../server/api";

const userFormSchema = z.object({
  email: z.string().min(1, { message: 'Endereço de email é obrigatório' }),
})

type Schema = z.infer<typeof userFormSchema>;

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(userFormSchema)
  });

  const onSubmit = async (data: Schema) => {
    try {
      const response = await api.post('/api/password-reset', { email: data.email });
      toast.success(response.data.message, {
        theme: "dark"
      });
    } catch (error: any) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        toast.error(error.response.data.message, {
          theme: "dark"
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-1 justify-center items-center bg-gray-950">
      <div className='bg-slate-900 rounded-lg p-8 max-w-md w-full '>
        <h1 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
          Esqueceu Senha
        </h1>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">Email:</label>
              <input id="email" {...register('email')}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              <button
                type="submit"
                className="flex mt-6 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Enviar
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  )
}