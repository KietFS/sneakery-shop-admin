import axios from "axios";
import { apiURL } from "../config/constanst";

export const loginService = async (email: string, password: string) => {
  try {
    const data = await axios.post(`${apiURL}/auth/signin`, {
      email,
      password,
    });
    if (data) return data;
  } catch (error) {
    console.log(error);
  }
};

export const registerService = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const data = await axios.post(`${apiURL}/auth/signup`, {
      username,
      email,
      password,
    });
    if (data) return data;
  } catch (error) {
    console.log(error);
  }
};

export const isExistedEmail = async (email: string) => {
  try {
    const isExisted = await axios.post(
      `${apiURL}/auth/checkemail`,

      {
        email: email,
      },
      {
        withCredentials: true,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }
    );
    return isExisted;
  } catch (error) {
    console.log(error);
  }
};
