import React from 'react';

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = true }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 capitalize" htmlFor={name}>
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
            />
        </div>
    );
};

export default InputField;
