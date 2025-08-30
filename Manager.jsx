import React, { useRef, useState, useEffect } from "react";
import { Eye, EyeOff, Copy, Check, Edit, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';


const Manager = () => {
  const ref = useRef();
  const showRef = useRef();
  const [form, setForm] = useState({ site: "", user: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPassword = async () => {
    let req = await fetch("http://localhost:3000/")
    let passwords = await req.json()
    setPasswordArray(passwords);
    console.log(passwords)

  }
  useEffect(() => {
    getPassword()
    
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };


  const copyText = (item) => {
    navigator.clipboard.writeText(item)
    navigator.clipboard.readText(item)
    alert("clipboard copied" + item)
  }

  const savePass = async () => {
    if (!form.site || !form.user || !form.password) {
      alert("Please fill all fields before saving");
      return;
    }
  
    try {
      // 1️⃣ Backend par POST request bhejna
      let res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...form, id: uuidv4() }) // id bhi bhej rahe hai
      });
  
      // 2️⃣ Response lena
      let result = await res.json();
      console.log("Saved:", result);
  
      // 3️⃣ UI update karna
      const newPasswords = [...passwordArray, { ...form, id: uuidv4() }];
      setPasswordArray(newPasswords);
  
      // 4️⃣ Form clear karna
      setForm({ site: "", user: "", password: "" });
  
    } catch (err) {
      console.error("Error saving password:", err);
      alert("Failed to save password");
    }
  };
  
  const deletePass = async (id) => {
    let c = confirm("Do you want to delete this item?");
    if (!c) return;
  
    try {
      // 1️⃣ Delete request bhejna
      let res = await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }) // id bhej rahe hain
      });
  
      let result = await res.json();
      console.log("Deleted:", result);
  
      if (result.success) {
        // 2️⃣ State update karna
        const newPasswords = passwordArray.filter((item) => item.id !== id);
        setPasswordArray(newPasswords);
      } else {
        alert("Failed to delete password");
      }
    } catch (err) {
      console.error("Error deleting password:", err);
      alert("Error deleting password");
    }
  };
  

  const editPass = (id) => {
    console.log("password edit" + id)
    setForm({...passwordArray.filter(i => i.id === id)[0], id: id})
    const newPasswords = passwordArray.filter((item) => item.id !== id);
    setPasswordArray(newPasswords);
  };

  const handdlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
      <div className="p-2 md:p-0 flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg p-6 md:p-8 rounded-2xl border border-gray-200 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center py-2">
            Manager Login
          </h2>

          <input
            type="text"
            name="site"
            onChange={handdlechange}
            placeholder="Enter site"
            value={form.site}
            className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* User + Password */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              name="user"
              value={form.user}
              onChange={handdlechange}
              placeholder="Enter email"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handdlechange}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                ref={ref}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={18}></EyeOff> : <Eye size={18}></Eye>}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={savePass}
            className="w-full cursor-pointer bg-black text-white font-semibold py-3 rounded-lg hover:bg-white border-2 border-black hover:text-black transition"
          >
            Save
          </button>

          {/* Table wrapper */}
          <div className="passwords mt-4 overflow-x-auto">
            <h1 className="font-bold py-4 text-xl">Your Passwords</h1>
            {passwordArray.length === 0 && <div>No password saved</div>}
            {passwordArray.length !== 0 && (
                  <table className="table-auto w-full rounded-xl overflow-hidden shadow-md">
                    <thead className="bg-black text-white text-sm">
                      <tr>
                        <th className="text-center py-3 px-4">Site</th>
                        <th className="text-center py-3 px-4">User</th>
                        <th className="text-center py-3 px-4">Password</th>
                        <th className="text-center py-3 px-4">Actions</th>
                      </tr>
                    </thead>
              
                    <tbody className="divide-y divide-gray-200">
                      {passwordArray.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 transition-colors duration-200"
                        >
                          {/* Site */}
                          <td className="text-center py-3 px-4 font-medium text-blue-600">
                            <a href={item.site} target="_blank" rel="noreferrer">
                              {item.site}
                            </a>
                            <button
                              onClick={() => copyText(item.site)}
                              className="ml-2 text-gray-500 hover:text-black"
                            >
                              <Copy size={16} />
                            </button>
                          </td>
              
                          {/* User */}
                          <td className="text-center py-3 px-4">
                            {item.user}
                            <button
                              onClick={() => copyText(item.user)}
                              className="ml-2 text-gray-500 hover:text-black"
                            >
                              <Copy size={16} />
                            </button>
                          </td>
              
                          {/* Password */}
                          <td className="text-center py-3 px-4">
                            {"*".repeat(item.password.length)}
                            <button
                              onClick={() => copyText(item.password)}
                              className="ml-2 text-gray-500 hover:text-black"
                            >
                              <Copy size={16} />
                            </button>
                          </td>
              
                          {/* Actions */}
                          <td className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  deletePass(item.id);
                                }}
                              >
                                <Trash2 size={18} />
                              </button>
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => {
                                  editPass(item.id);
                                }}
                              >
                                <Edit size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               
            
              
             
              
            )}
          </div>
        </div>
      </div>


    </>
  );
};

export default Manager
