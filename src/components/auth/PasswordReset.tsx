import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeSlash } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";
import api from "../../server/api";

const userFormSchema = z.object({
  password: z.string().trim().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }).max(26, { message: 'A senha não deve ter mais de 26 caracteres' }),
  confirmPassword: z.string().trim().min(6, { message: 'A confirmação de nova senha deve ter pelo menos 6 caracteres' }).trim(),
})
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type Schema = z.infer<typeof userFormSchema>;

export default function PasswordReset() {
  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(userFormSchema)
  });
  const { id, token } = useParams();
  const [validUrl, setValidUrl] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const url = `/api/password-reset/${id}/${token}`

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await api.get(url)
        setValidUrl(true)
      } catch (error) {
        setValidUrl(false)
      }
    }
    verifyUrl()
  }, [id, token])

  const onSubmit = async (data: Schema) => {
    try {
      const response = await api.post(url, { password: data.password });
      toast.success(response.data.message, {
        theme: "dark"
      });
      navigate('/login');
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
    <>
      {validUrl ? (<div className="flex min-h-screen flex-1 justify-center items-center bg-gray-950">
        <div className='bg-slate-900 rounded-lg p-8 max-w-md w-full '>
          <h1 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
            Esqueceu Senha
          </h1>
          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-200">Nova senha:</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
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
                <label className="block text-sm font-medium leading-6 text-gray-200">Confirmar nova senha:</label>
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
                  Enviar
                </button>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div >
      </div >
      ) : (
        <h1>404 Não Encontrado</h1>
      )
      }
    </>
  )
}