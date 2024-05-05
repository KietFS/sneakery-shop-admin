import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import { setAccessToken, setUser } from "../../redux/slices/auth";
import LogoutConfirmDialog from "../LogoutConfirmDialog";

interface IHeaderProps {
  title: string;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const logOut = () => {
    try {
      console.log("LOG OUT");
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
      dispatch(setUser(null));
      dispatch(setAccessToken(null));
      toast.success("Đăng xuất thành công", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-between px-5 py-[16.5px] border-b border-b-gray-300 items-center">
      <h2 className="text-2xl text-gray-600 font-bold">{props.title}</h2>
      <div className="flex space-x-4   items-center">
        <p className="text-gray-500 font-bold text-lg">
          Xin chào {user?.username} !
        </p>
        <button
          className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full hover:opacity-50"
          onClick={() => setOpen(true)}
        >
          Đăng xuất
        </button>
      </div>
      <LogoutConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={logOut}
      />
    </div>
  );
};

export default Header;
