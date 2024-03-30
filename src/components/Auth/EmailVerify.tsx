import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../server/api";

export default function EmailVerify() {
  const [validUrl, setValidUrl] = useState(true);
  const { id, token } = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const response = await api.get(`/api/users/${id}/verify/${token}`);
        console.log(response.data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [id, token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
      {validUrl ? (
        <div className="text-center">
          <h1 className="text-xl font-bold text-green-500">Email verificado com sucesso!</h1>
          <Link to="/login">
            <button className="py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-500">Erro: Ocorreu um erro ao verificar o email.</h1>
          <Link to="/login">
            <button className="py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}