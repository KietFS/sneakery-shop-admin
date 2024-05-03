import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import MainLayout from "../../layouts/MainLayout";
import { Button, TablePagination } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import Spinner from "../../components/Spinner";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ActionMenu from "../UserManagement/ActionMenu";
import { toast } from "react-toastify";
import ChangeStatusActionMenu from "./ChangeStatusActionMenu";

interface IOrder {
  id: number;
  product: IProduct;
  priceWin: number;
}

interface IProduct {
  id: number;
  name: string;
  startPrice: number;
  imagePath: string;
  username: string;
  bidClosingDate: string;
}

const OrderManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>("");

  const status = {
    new: {
      color: "text-gray-500",
      background: "text-gray-100",
      text: "Đơn hàng mới",
    },
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "userId",
      headerName: "Người mua",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <p className="">{params.value.username}</p>;
      },
    },
    {
      field: "userAddress",
      headerName: "Người mua",
      width: 300,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <p className="">{params.row.userId.address}</p>;
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        const changeStatusOrder = async (
          id: string | number,
          status: "PENDING" | "APPROVED"
        ) => {
          try {
            setActionLoading(true);
            setSelectedRow(id);
            //THIS NEED TO FIX
            const response = await axios.put(
              `${apiURL}/orders/${id}/`,
              {
                status: status,
              },
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );

            if (response?.data?.success) {
              setActionLoading(false);
              refreshOrders();
              toast.success("Cập nhật đơn hàng thành công");
            } else {
              console.log("Error", response?.data?.data, response?.data?.error);
            }
          } catch (error) {
            setActionLoading(false);
            console.log("Client Error", error);
          }
        };
        const options = [
          {
            id: "new",
            name: "Làm mới đ",
          },
        ];
        return actionLoading && selectedRow == params.row?.id ? (
          <Spinner size={20} />
        ) : (
          <ChangeStatusActionMenu
            label={params.value}
            options={options.filter((id) => id !== params.value)}
          />
        );
      },
    },
    {
      field: "paymentType",
      headerName: "Phương thức thanh toán",
      width: 250,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <p className="">
            {params.value == "cod"
              ? "Thu tiền sau khi nhận hàng"
              : "Thanh toán qua ví điện tử"}
          </p>
        );
      },
    },
    {
      field: "totalPrice",
      headerName: "Giá trị",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <p className="">{(params.value as string).prettyDate()}</p>;
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      type: "string",
      width: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const changeStatusOrder = async (
          id: string | number,
          status: "PENDING" | "APPROVED"
        ) => {
          try {
            setActionLoading(true);
            setSelectedRow(id);
            //THIS NEED TO FIX
            const response = await axios.put(
              `${apiURL}/orders/${id}/`,
              {
                status: status,
              },
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );

            if (response?.data?.success) {
              setActionLoading(false);
              refreshOrders();
              toast.success("Cập nhật đơn hàng thành công");
            } else {
              console.log("Error", response?.data?.data, response?.data?.error);
            }
          } catch (error) {
            setActionLoading(false);
            console.log("Client Error", error);
          }
        };
        const options = [
          params?.row?.status == "PENDING"
            ? {
                id: "pending",
                title: "Duyệt đơn hàng",
                onPress: () => changeStatusOrder(params.row?.id, "APPROVED"),
                onActionSuccess: () => refreshOrders(),
              }
            : {
                id: "approved",
                title: "Hủy đơn hàng",
                onPress: () => changeStatusOrder(params.row?.id, "PENDING"),
                onActionSuccess: () => refreshOrders(),
              },
        ];
        return actionLoading && selectedRow == params.row?.id ? (
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
  ];

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (!!response) {
        const filterResponse = response?.data?.results?.map(
          (item: any, index: number) => {
            return {
              ...item,
              id: item._id,
            };
          }
        );
        setOrders(filterResponse);
      }
    } catch (error) {
      console.log("GET ALL ORDER ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const response = await axios.get(`${apiURL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      response && setOrders(response?.data?.data as IOrder[]);
    } catch (error) {
      console.log("GET ALL ORDER ERROR", error);
    } finally {
    }
  };

  React.useEffect(() => {
    user && getAllOrders();
  }, [user]);

  return (
    <MainLayout
      title="Quản lý đơn hàng"
      content={
        loading ? (
          <div className="w-full h-full px-8 mt-20">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-y-5 bg-white shadow-xl rounded-2xl">
            <div className="flex flex-row justify-between items-center"></div>
            <div className="h-[800px] w-full">
              <DataGrid
                rows={orders}
                columns={columns}
                pageSize={15}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
                onSelectionModelChange={(newSelectionModel) => {
                  console.log("NEW SELECTION MODEL", newSelectionModel);
                  setDeleteDisable(!deleteDisable);
                  setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
                checkboxSelection
              />
            </div>
          </div>
        )
      }
    />
  );
};

export default OrderManagement;
