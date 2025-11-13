import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import failImg from "../../images/verify-fail.png";
import successImg from "../../images/verify-success.png";
import api from "../../server/api";

export default function EmailVerify() {
  const [validUrl, setValidUrl] = useState(true);
  const [message, setMessage] = useState("");
  const { id, token } = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const response = await api.get(`/api/users/${id}/verify/${token}`);
        console.log(response.data);
        setValidUrl(true);
        setMessage(response.data.message);
      } catch (error: any) {
        console.log(error);
        setValidUrl(false);
        setMessage(error.response.data.message);
      }
    };
    verifyEmailUrl();
  }, [id, token]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-950">
      {validUrl ? (
        <div className='flex flex-col items-center bg-slate-900 rounded-lg p-8 max-w-md w-full'>
          <img src={successImg} alt="Email Verified" className="w-28 h-28 mb-4" />
          <h1 className="text-xl font-bold text-green-500">{message}</h1>
          <Link to="/login">
            <button className="flex mt-6 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div className='flex flex-col items-center bg-slate-900 rounded-lg p-8 max-w-md w-full'>
          <img src={failImg} alt="Email Verified" className="w-28 h-28 mb-4" />
          <h1 className="text-xl font-bold text-red-500">{message}</h1>
          <Link to="/login">
            <button className="flex mt-6 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
