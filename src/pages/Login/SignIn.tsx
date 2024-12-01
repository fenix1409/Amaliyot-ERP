import { useContext, useState } from "react";
import axios from "axios";
import { Input } from "antd";
import toast, { Toaster } from "react-hot-toast";
import BG from '../../assets/images/login-bg.png'
import { Context } from "../../context/Context";
import { API } from "../../hook/useEnv";
import { Logo } from "../../assets/images/Icons";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

export const SignIn = () => {
  const { setToken } = useContext(Context);
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)

    const loginData = {
      login: userName,
      password: password,
    };
    
    try {
      const response = await axios.post(`${API}/api/staff/auth/sign-in`, loginData );
      if (response.status === 200) {
        const token = response.data.data.accessToken;
        
        toast.success("Xush kelibsiz!");
        setToken(token);
        
        localStorage.setItem("authToken", token);
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000);
      } else {
        toast.error("Login yoki parol xato!");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring!");
      console.error(error);
    }
  };

  return (
    <div className='flex'>
    <Toaster position="top-center" reverseOrder={false} />
    <img className='w-[600px] h-[728px]' src={BG} alt="login bg" width={600} />
    <div className='pt-[60px] pl-[80px]'>
      <Logo />
      <form onSubmit={loginSubmit} className='mt-[100px] w-[380px]' autoComplete='off'>
        <h1 className='text-[32px] mb-[32px] leading-[48px]'>Tizimga kirish</h1>
        <label className='block mb-[16px]'>
          <span className='text-[14px] leading-[21px] text-[#0A0B0A] mb-2'>Login</span>
          <Input onChange={(e) => setUserName(e.target.value)} className='w-full bg-transparent' placeholder='Loginni kiriting' required />
        </label>
        <label>
          <span className='text-[14px] leading-[21px] text-[#0A0B0A] mb-2'>Parol</span>
          <Input.Password onChange={(e) => setPassword(e.target.value)} className='w-full bg-transparent' placeholder='Parol kiriting' required />
        </label>
        <button type='submit' className='w-full py-3 bg-[#0EB182] block text-[14px] leading-[14px] text-white rounded-lg mt-8'>{isLoading ? <LoadingOutlined/> : "Kirish"}</button>
      </form>
    </div>
  </div>
  );
};
