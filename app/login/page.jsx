"use client";

import { signIn } from "next-auth/react";
import { useState , useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // menggunakan react-icons
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // state untuk toggle password


// Kosongkan input saat pertama kali halaman dimuat
  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    

    // untuk menyimpan data ke variabel sementara agar tidak kehilangan sebelum signIn
    const user = username;
    const pass = password;

    //untuk mengosongkan field segera setelah klik login
    setUsername("");
    setPassword("");

    // untuk menjalankan proses login
    await signIn("credentials", {
      username: user,
      password: pass,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('/pokeball.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh'
        }}
    >
    
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-3 p-6 shadow-xl/20 w-80 bg-white rounded"
      >
        <h1 className="text-3xl font-medium mb-4 text-center text-yellow">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border bg-white border-yellow-300 p-2 rounded"
        />
        <div className="relative border-yellow-300 border rounded">
          <input
            type={showPassword ? "text" : "password"} // toggle type
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" p-2 rounded w-full pr-10"            
          />  
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer select-none text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          
        </div>
        
        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 rounded hover:bg-orange-600 cursor-pointer"
        >
          Login
        </button>
      </form>
    </motion.div>
  );
}
