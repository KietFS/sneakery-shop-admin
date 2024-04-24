import React, { ReactComponentElement, ReactNode } from "react";

import {
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  GiftIcon,
  InboxStackIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

interface IMainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout: React.FC<IMainLayoutProps> = (props) => {
  return (
    <div className="flex  space-x-30 w-full">
      <div className="flex flex-col space-y-8  py-4 w-[400px] pt-4 border-r border-r-gray-300 h-screen">
        <div className="h-[50px] flex flex-start border-b border-b-gray-300">
          <h1 className="text-blue-500 text-2xl font-bold curor-pointer ml-4">
          Sneakery Admin
           </h1>
        </div>
        <Link to="/home">
          <div className="flex items-center space-x-3  py-4 px-4 hover:bg-gray-100 cursor-pointer">
            <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />
            <p className="text-gray-500 font-semibold text-lg">Tổng quan</p>
          </div>
        </Link>
        <Link to="/user-management">
          <div className="flex items-center space-x-3  py-4 px-4 hover:bg-gray-100 cursor-pointer">
            <UserCircleIcon className="h-6 w-6 text-gray-500" />
            <p className="text-gray-500 font-semibold text-lg">
              Quản lý người dùng
            </p>
          </div>
        </Link>
        <Link to="/category-management">
          <div className="flex items-center space-x-3  py-4 px-4 hover:bg-gray-100 cursor-pointer">
            <TagIcon className="h-6 w-6 text-gray-500" />
            <p className="text-gray-500 font-semibold text-lg">
              Quản lý danh mục
            </p>
          </div>
        </Link>
        <Link to="/products-management">
          <div className="flex items-center space-x-3  py-4 px-4 hover:bg-gray-100 cursor-pointer">
            <InboxStackIcon className="h-6 w-6 text-gray-500" />
            <p className="text-gray-500 font-semibold text-lg">
              Quản lý sản phẩm
            </p>
          </div>
        </Link>

        <Link to="/bid-management">
          <div className="flex items-center space-x-3  py-4 px-4 hover:bg-gray-100 cursor-pointer">
            <CurrencyDollarIcon className="h-6 w-6 text-gray-500" />
            <p className="text-gray-500 font-semibold text-lg">
              Quản lý lượt đấu giá
            </p>
          </div>
        </Link>
        <Link to="/orders-management">
          <div className="flex items-center space-x-3  py-4 px-4 hover:bg-gray-100 cursor-pointer">
            <GiftIcon className="h-6 w-6 text-gray-500" />
            <p className="text-gray-500 font-semibold text-lg">
              Quản lý đơn hàng
            </p>
          </div>
        </Link>
      </div>
      <div className="w-full">
        <Header title={props.title} />
        <div className="mt-10 px-5">{props.children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
