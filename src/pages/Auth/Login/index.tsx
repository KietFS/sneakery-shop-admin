import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import LoginBackground from "../../../assets/images/LoginBackground.png";

//components
import InputPassword from "../../../designs/InputPassword";
import InputEmail from "../../../designs/InputEmail";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSelector } from "../../../hooks/useRedux";
import { IRootState } from "../../../redux";
// import { useAppSelector } from "../../../hooks/useRedux";
// import { IRootState } from "../../../redux";
// import { useRouter } from "next/router";

interface ILoginPageProps {}

interface IFormValue {
  email: string;
  password: string;
}

const validationSchema = yup.object().shape<{ [k in keyof IFormValue]: any }>({
  email: yup.string().required("Vui lòng nhập email của bạn"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải lớn hơn 6 kí tự")
    .required("Vui lòng nhập mật khẩu của bạn"),
});
const LoginPage: React.FC<ILoginPageProps> = () => {
  const { googleLogin, login, loginLoading, loginError } = useAuth();
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const [initialValues, setInitialValues] = useState<IFormValue>({
    email: "",
    password: "",
  });

  const handleSubmit = (values: IFormValue) => {
    login(values.email, values.password);
  };



  return (
    <>
      <head>
        <title>Sneakry - Đăng nhập</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <div className="h-screen w-screen flex flex-col laptop:flex laptop:flex-row justify-center items-center px-4 laptop:px-20 laptop:space-x-20">
        <div className="hidden laptop:block h-screen items-center pt-48">
          <img
            src={LoginBackground}
            width={450}
            height={450}
            className="my-auto"
          />
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, submitForm, errors }) => {
            return (
              <div className="space-y-7">
                <div className="space-x-1">
                  <h1 className="text-center text-blue-600 text-4xl font-bold">
                    Sneakery
                  </h1>
                  <p className="text-sm text-center text-gray-600 mt-2">
                    Trang quản lý dành cho admin
                  </p>
                </div>
                <div className="space-y-5">
                  {loginError && (
                    <p className="text-blue-500">Đã có lỗi xảy ra</p>
                  )}
                  <InputEmail name="email" label="Email" required />
                  <InputPassword name="password" label="Mật khẩu" required />
                </div>
                <button
                  type="submit"
                  onClick={submitForm}
                  className="bg-blue-500 font-bold text-white  rounded-lg w-80 h-10"
                >
                  {loginLoading ? "..." : "Đăng nhập"}
                </button>
              </div>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default LoginPage;
