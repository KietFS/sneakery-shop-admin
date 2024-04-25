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

interface IUser {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  address?: IAddress;
}

export interface IAddress {
  addressId: number;
  homeNumber: string;
  city: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  ward: {
    id: number;
    name: string;
  };
}

const UserManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);

  const { user } = useAppSelector((state: IRootState) => state.auth);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [totalRecord, setTotalRecord] = React.useState<number>(0);

  const ROW_PER_PAGE = 10;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Tên người dùng", width: 400 },
    {
      field: "email",
      headerName: "Emai",
      width: 300,
    },
    {
      field: "isActive",
      headerName: "Trạng thái",
      type: "string",
      width: 150,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value === true ? (
          <p className="px-2 py-1 text-green-800 bg-green-50 rounded-full text-xs font-bold">
            Đang hoạt động
          </p>
        ) : (
          <p className="px-2 py-1 text-red-800 bg-red-50 rounded-full text-xs font-bold">
            Đã bị khóa
          </p>
        ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      type: "string",
      width: 300,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const handleDeactivateUser = async (id: string | number) => {
          try {
            const payload = {
              isActive: false,
            };
            const response = await axios.put(
              `${apiURL}/admin/profiles/${id}`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );

            if (response?.data?.success == true) {
              toast.success("Vô hiệu hóa tài khoản thành công");
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
              `${apiURL}/admin/profiles/${id}`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
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
        return <ActionMenu options={options} />;
      },
    },
  ];

  const getAllUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.success == true) {
        console.log("response", response?.data?.results);
        setUsers(response?.data?.data);
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
      const response = await axios.get(
        `${apiURL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response?.data?.success == true) {
        setUsers(response?.data?.results);
        setTotalRecord(response?.data?.totalRecords);
      }
    } catch (error) {
      console.log("GET USER ERROR", error);
    } finally {
    }
  };

  React.useEffect(() => {
    getAllUser();
  }, [page]);

  return (
    <MainLayout
      title="Quản lý người dùng"
      children={
        loading ? (
          <div className="w-full h-full px-8 mt-20">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-y-5">
            <div className="h-[700px] w-full">
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
