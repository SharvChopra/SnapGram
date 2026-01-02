import { useState, useEffect } from "react";

const InputField = ({ type, placeholder, value, onChange, name }) => {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (value && value.length > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [value]);

  const handleFocus = () => setIsActive(true);
  const handleBlur = (e) => {
    if (!e.target.value) {
      setIsActive(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full mb-1.5 h-9.5 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] focus-within:border-[#a8a8a8] flex items-center transition-all duration-100">
      <label
        className={`absolute left-2 transition-all duration-100 pointer-events-none text-[#737373] overflow-hidden text-ellipsis whitespace-nowrap right-2 select-none
                    ${
                      isActive ? "top-0.5 text-[10px]" : "top-2.5 text-xs"
                    }`}
      >
        {placeholder}
      </label>
      <input
        type={inputType}
        name={name}
        className={`bg-transparent outline-none border-none w-full h-full px-2 text-xs text-[#262626] ${
          isActive ? "pt-3.5 pb-0.5" : "py-2.25"
        }`}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {type === "password" && value && value.length > 0 && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-2 text-sm font-semibold text-[#262626] bg-transparent border-none cursor-pointer hover:opacity-50 select-none pb-1"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
};

export default InputField;
