import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import MainLayout from "../../layouts/MainLayout";
import { Button, Pagination, TablePagination } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import { apiURL } from "../../config/constanst";

import ActionMenu from "./ActionMenu";
import { toast } from "react-toastify";
import LoadingSkeleton from "../../components/LoadingSkeleton";

type IUserRole = "admin" | "shopper";

interface IUser {
  id: string;
  username: string;
  email: string;
  role: IUserRole;
}

const UserManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);

  const { user, accessToken } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [totalRecord, setTotalRecord] = React.useState<number>(0);

  const ROW_PER_PAGE = 10;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Tên người dùng", width: 250 },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "address",
      headerName: "Dia chi",
      width: 200,
    },
    {
      field: "phoneNumber",
      headerName: "So dien thoai",
      width: 200,
    },
    {
      field: "isActive",
      headerName: "Trang thai",
      type: "string",
      width: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value === true ? (
          <p className="px-2 py-1 text-green-800 bg-green-50 rounded-full text-xs font-bold">
            Dang hoat dong
          </p>
        ) : (
          <p className="px-2 py-1 text-yellow-800 bg-yellow-50 rounded-full text-xs font-bold">
            Da bi vo hieu hoa
          </p>
        ),
    },
    {
      field: "role",
      headerName: "Vai trò",
      type: "string",
      width: 150,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "actions",
      headerName: "Hành động",
      type: "string",
      width: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const handleDeactivateUser = async (id: string | number) => {
          try {
            const payload = {
              isActive: false,
            };
            const response = await axios.put(
              `${apiURL}/admin/users/deactivate/${id}`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (response?.data?.success == true) {
              toast.success(
                response?.data?.message || "Vo hieu hoa tai khoan thanh cong"
              );
              refreshUser();
            } else {
            }
          } catch (error) {
            console.log("error");
          }
        };

        const handleActivateUser = async (id: string | number) => {
          try {
            const payload = {
              isActive: true,
            };
            const response = await axios.put(
              `${apiURL}/admin/users/activate/${id}`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (response?.data?.success == true) {
              toast.success("Kích hoạt tài khoản thành công");
              refreshUser();
            } else {
            }
          } catch (error) {
            console.log("error");
          }
        };

        const options = [
          params?.row?.isActive == true
            ? {
                id: "deactivate",
                title: "Vô hiệu hóa tài khoản",
                onPress: () => handleDeactivateUser(params.row?.id),
                onActionSuccess: () => refreshUser(),
              }
            : {
                id: "activate",
                title: "Kích hoạt tài khoản",
                onPress: () => handleActivateUser(params.row?.id),
                onActionSuccess: () => refreshUser(),
              },
        ];
        return (
          <>
            {params.row.role == "admin" ? null : (
              <ActionMenu options={options} />
            )}
          </>
        );
      },
    },
  ];

  console.log("ACC", accessToken);
  const getAllUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success == true) {
        setUsers(
          response?.data?.results?.map((user: any) => {
            return {
              ...user,
              id: user._id,
            };
          })
        );
        setTotalRecord(response?.data?.totalRecords);
      }
    } catch (error) {
      console.log("GET USER ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success == true) {
        setUsers(
          response?.data?.results?.map((user: any) => {
            return {
              ...user,
              id: user._id,
            };
          })
        );
        setTotalRecord(response?.data?.totalRecords);
      }
    } catch (error) {
      console.log("GET USER ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllUser();
  }, []);

  return (
    <MainLayout
      title="Quản lý người dùng"
      content={
        loading ? (
          <div className="w-full h-full px-8 mt-20">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-y-5 bg-white shadow-xl rounded-2xl">
            <div className="h-[800px] w-full">
              <DataGrid
                rows={users}
                paginationMode="server"
                page={page}
                rowCount={totalRecord}
                pageSize={10}
                columns={columns}
                disableSelectionOnClick
                onPageChange={(current) => setPage(current)}
                onSelectionModelChange={(newSelectionModel) => {
                  setDeleteDisable(!deleteDisable);
                  setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
                checkboxSelection={false}
              />
            </div>
          </div>
        )
      }
    />
  );
};

export default UserManagement;
