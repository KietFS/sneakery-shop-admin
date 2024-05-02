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

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "product",
      headerName: "Tên sản phẩm",
      type: "string",
      width: 400,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<IProduct>) => (
        <p>{params.value?.name}</p>
      ),
    },

    { field: "priceWin", headerName: "Giá cuối cùng", width: 200 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params: GridRenderCellParams<IProduct>) => (
        <>
          {params.row.status == "PENDING" ? (
            <div className="rounded-full bg-yellow-200 text-yellow-800 font-semibold px-[10px] py-[4px] text-[12px] w-fit">
              Đang chờ duyệt
            </div>
          ) : (
            <div className="rounded-full bg-green-200 text-green-800 font-semibold px-[10px] py-[4px] text-[12px] w-fit">
              Đã duyệt
            </div>
          )}
        </>
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
      const response = await axios.get(`${apiURL}/orders`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      response && setOrders(response?.data?.data as IOrder[]);
    } catch (error) {
      console.log("GET ALL ORDER ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const response = await axios.get(`${apiURL}/orders`, {
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
          <div className="w-full flex flex-col gap-y-5">
            <div className="flex flex-row justify-between items-center"></div>
            <div className="h-[700px] w-full">
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
