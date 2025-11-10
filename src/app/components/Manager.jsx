"use client";

import { act, use, useEffect, useRef, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PasswordManagerForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    site: "",
    username: "",
    password: "",
  });
  const [passwordArray, setPasswordArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log("yeh leeeeeeeeeeee passwordArray", passwordArray);
  console.log("yeh leeeeeeeeeeee form", form);
  console.log("yeh leeeeeeeeeeee showPassword", showPassword);

  const savePassword = async () => {
    // Validation: Check if all fields are filled
    if (!form.site.trim() || !form.username.trim() || !form.password.trim()) {
      return toast.error("Please fill all fields!");
    }

    // Validation: Check username length
    if (form.username.length < 6) {
      return toast.error("Username must be at least 9 characters long!");
    }

    setIsLoading(true);

    try {
      // Generate ID once for both operations
      const newId = form.id || uuidv4();
      const passwordData = { ...form, id: newId };
      console.log("yeh leeeeeeeeeeee passwordData", passwordData);
      // If editing (form has existing id), delete the old entry first
      if (form.id) {
        await fetch("/api", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: form.id }),
        });
      }

      // Save new password to database
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error("Failed to save password");
      }

      // Update local state
      setPasswordArray([...passwordArray, passwordData]);

      toast.success(form.id ? "Password Updated!" : "Password Saved!");

      // Reset form
      setForm({
        site: "",
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Error saving password:", error);
      toast.error("Failed to save password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const DeleteFunc = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this password?"
    );

    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete password");
      }

      // Update local state only after successful deletion
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      toast.success("Password Deleted!");
    } catch (error) {
      console.error("Error deleting password:", error);
      toast.error("Failed to delete password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const EditFunc = (id) => {
    const passwordToEdit = passwordArray.find((item) => item.id === id);

    if (!passwordToEdit) {
      toast.error("Password not found!");
      return;
    }

    // Load password data into form for editing
    setForm(passwordToEdit);

    // Remove from display (will be re-added on save)
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const getPasswords = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api");

      if (!response.ok) {
        throw new Error("Failed to fetch passwords");
      }

      const passwords = await response.json();

      // Check if passwords is an array and has content
      if (Array.isArray(passwords) && passwords.length > 0) {
        setPasswordArray(passwords);
      } else {
        setPasswordArray([]);
        console.log("No passwords found");
      }
    } catch (error) {
      console.error("Error fetching passwords:", error);
      toast.error("Failed to load passwords");
      setPasswordArray([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [active, setActive] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.45), transparent 70%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.5), transparent 70%)`,
        }}
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-[70%]">
          <h1 className="text-center font-bold text-3xl my-5 text-blue-600">
            {"<PassOP />"}
          </h1>
          {/* Form Fields */}
          <div className="main-box ">
            <div>
              {/* Website URL Field */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Website URL
                </label>
                <div style={{ position: "relative" }}>
                  <svg
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "#9ca3af",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <input
                    onChange={(e) => handleChange(e)}
                    name="site"
                    value={form.site}
                    type="url"
                    placeholder="https://example.com"
                    style={{
                      width: "100%",
                      height: "3rem",
                      color: "black",
                      paddingLeft: "2.75rem",
                      paddingRight: "1rem",
                      fontSize: "0.875rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      outline: "none",
                      transition: "all 0.2s",
                      background: "rgba(255, 255, 255, 0.5)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      e.target.style.background = "rgba(255, 255, 255, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "rgba(255, 255, 255, 0.5)";
                    }}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <svg
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",

                      transform: "translateY(-50%)",
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "#9ca3af",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    onChange={(e) => handleChange(e)}
                    name="username"
                    value={form.username}
                    type="text"
                    placeholder="Enter your username"
                    style={{
                      width: "100%",
                      height: "3rem",
                      color: "black",
                      paddingLeft: "2.75rem",
                      paddingRight: "1rem",
                      fontSize: "0.875rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      outline: "none",
                      transition: "all 0.2s",
                      background: "rgba(255, 255, 255, 0.5)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      e.target.style.background = "rgba(255, 255, 255, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "rgba(255, 255, 255, 0.5)";
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <svg
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "#9ca3af",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    onChange={(e) => handleChange(e)}
                    name="password"
                    value={form.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    style={{
                      width: "100%",
                      height: "3rem",
                      color: "black",
                      paddingLeft: "2.75rem",
                      paddingRight: "2.75rem",
                      fontSize: "0.875rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      outline: "none",
                      transition: "all 0.2s",
                      background: "rgba(255, 255, 255, 0.5)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      e.target.style.background = "rgba(255, 255, 255, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "rgba(255, 255, 255, 0.5)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      padding: "0.25rem",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#667eea")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9ca3af")
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginBottom: "1.5rem" }}>
              <button
                style={{
                  width: "100%",
                  height: "3rem",
                  background: "oklch(54.6% 0.245 262.881)",
                  color: "white",
                  fontWeight: "500",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  margin: "1rem 0",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                }}
                onClick={savePassword}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(102, 126, 234, 0.3)";
                }}
              >
                Save Password
              </button>
            </div>
          </div>
          {/* Your Passwords */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Your Passwords Here:
            </h2>
            {passwordArray.length < 1 && "No Passwords to show..."}

            {passwordArray.length > 1 && (
              <table className=" table-auto text-purple-900">
                <thead className="">
                  <tr className="text-left  ">
                    <th className="p-2">Website</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Password</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passwordArray.map((element, index) => {
                    return (
                      <tr key={index} className="">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <a href={element.site} target="_blank">
                              {element.site}
                            </a>

                            <FaCopy
                              className={`cursor-pointer `}
                              //   style={{ color: active ? "blue" : "black" }}
                              onClick={(e) => {
                                toast.success(`"${element.site}" Copied!`);

                                setActive(active ? false : true); // turn blue
                                navigator.clipboard.writeText(element.site);

                                active
                                  ? (e.currentTarget.style.color = "black")
                                  : (e.currentTarget.style.color = "blue");
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span>{element.username}</span>
                            <FaCopy
                              className={`cursor-pointer `}
                              //   style={{ color: active ? "blue" : "black" }}
                              onClick={(e) => {
                                toast.success(`"${element.username}" Copied!`);
                                setActive(!active); // turn blue
                                navigator.clipboard.writeText(element.username);

                                active
                                  ? (e.currentTarget.style.color = "black")
                                  : (e.currentTarget.style.color = "blue");
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          {" "}
                          <div className="flex items-center gap-2">
                            <span>{element.password}</span>
                            <FaCopy
                              className={`cursor-pointer `}
                              //   style={{ color: active ? "blue" : "black" }}
                              onClick={(e) => {
                                toast.success(`"${element.password}" Copied!`);
                                setActive(!active); // turn blue
                                navigator.clipboard.writeText(element.password);

                                active
                                  ? (e.currentTarget.style.color = "black")
                                  : (e.currentTarget.style.color = "blue");
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-2 flex gap-2">
                          <button
                            onClick={() => {
                              DeleteFunc(element.id);
                            }}
                            className=" cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              EditFunc(element.id);
                            }}
                            className=" cursor-pointer px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <ToastContainer />
          <p
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
