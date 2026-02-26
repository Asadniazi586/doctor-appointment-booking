import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DoctorForgotPassword = () => {
  const { backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  const hasLength = newPassword.length >= 7;

  const passedCount = [hasLength, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrength = () => {
    if (!newPassword) return null;

    if (newPassword.length < 7) {
      return { color: "bg-red-500", width: "25%" };
    }

    if (passedCount === 2) {
      return { color: "bg-yellow-500", width: "60%" };
    }

    if (passedCount === 3) {
      return { color: "bg-green-500", width: "100%" };
    }

    return { color: "bg-red-500", width: "25%" };
  };

  const strength = getStrength();
  const isStrong = strength?.width === "100%";
  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  const handleCapsLock = (e) => {
    setCapsOn(e.getModifierState("CapsLock"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isStrong) {
      return toast.error("Password is not strong enough");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/reset-password`,
        { email, newPassword }
      );

      if (data.success) {
        toast.success("Password reset successful");
        navigate("/", { state: { role: "Doctor" } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col mt-10 gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto text-[#5F6FFF]">
          Doctor Reset Password
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
          />
        </div>

        <div className="w-full relative">
          <p>New Password</p>
          <input
            type={showNewPassword ? "text" : "password"}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyUp={handleCapsLock}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10"
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-9 cursor-pointer"
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {capsOn && (
            <p className="text-xs text-red-500 mt-1">Caps Lock is ON</p>
          )}

          <div className="mt-2">
            {strength && (
              <>
                <div className="w-full h-2 bg-gray-200 rounded mb-1">
                  <div
                    className={`h-2 rounded ${strength.color} transition-all duration-500`}
                    style={{ width: strength.width }}
                  ></div>
                </div>

                {/* Labels under bar */}
                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>Weak</span>
                  <span>Medium</span>
                  <span>Strong</span>
                </div>
              </>
            )}

            <p className="text-xs font-medium text-gray-600 mt-1">
              Password must include:
            </p>

            <ul className="text-xs mt-1 space-y-1">
              <li className={hasLength ? "text-green-600" : "text-gray-400"}>
                {hasLength ? "✔" : "○"} Minimum 7 characters
              </li>
              <li className={hasNumber ? "text-green-600" : "text-gray-400"}>
                {hasNumber ? "✔" : "○"} At least one number
              </li>
              <li className={hasSpecial ? "text-green-600" : "text-gray-400"}>
                {hasSpecial ? "✔" : "○"} At least one special character
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full relative">
          <p>Confirm Password</p>
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyUp={handleCapsLock}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 cursor-pointer"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {confirmPassword && !passwordsMatch && (
            <p className="text-xs mt-1 text-red-500">
              Passwords do not match
            </p>
          )}
        </div>

        <button
          disabled={loading || !isStrong}
          className={`bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base flex items-center justify-center gap-2 ${
            loading || !isStrong ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </form>
  );
};

export default DoctorForgotPassword;
