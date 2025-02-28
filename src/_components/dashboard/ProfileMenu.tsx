import React from "react";
import { RxAvatar } from "react-icons/rx";

const ProfileMenu = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4 gap-3">
        <RxAvatar size={40} color="black" />

        <div>
          <h3 className="text-lg font-semibold text-gray-600">Ahmed Amaar</h3>
          <p className="text-sm text-gray-600">UX UI designer</p>
        </div>
      </div>
      <ul>
        <li className="mb-2">
          <a href="#" className="text-green-500 hover:text-green-700">
            Settings and privacy
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-green-500 hover:text-green-700">
            Language
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-green-500 hover:text-green-700">
            Help
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-green-500 hover:text-green-700">
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileMenu;
