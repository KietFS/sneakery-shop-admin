import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import MainLayout from "../../layouts/MainLayout";
import { Button, Skeleton, TablePagination } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import Spinner from "../../components/Spinner";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ActionMenu from "../../components/ActionMenu";
import { toast } from "react-toastify";

interface IProductHomePageResponse {
  id: string;
  name: string;
  startPrice: number;
  imagePath: string;
  username: string;
}

const ProductManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const [products, setProducts] = React.useState<IProductHomePageResponse[]>(
    []
  );
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [totalRecord, setTotalRecord] = React.useState<number>(0);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>("");

  const ROW_PER_PAGE = 10;

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      response && setProducts(response?.data?.results.map((item: any) => {
        return {
          ...item,
          id: item?._id,
        }
      }));
    } catch (error) {
      console.log("GET PRODUCT RESPONSE", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      response && setProducts(response?.data?.data);
    } catch (error) {
      console.log("GET PRODUCT RESPONSE", error);
    } finally {
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Tên sản phẩm", width: 460 },
    {
      field: "price",
      headerAlign: "left",
      align: "left",
      headerName: "Giá sản phẩm",
      type: "number",
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <div className="w-[120px]">
            <p>{params.value?.toString()?.prettyMoney()}</p>
          </div>
        );
      },
    },

    {
      field: "thumbnail",
      headerName: "Hình ảnh",
      type: "string",
      width: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <div className="w-[120px]">
            <img src={params.value} width={80} height={60} />
          </div>
        );
      },
    },
    {
      field: "totalRate",
      headerName: "Lượt đánh giá",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Hành động",
      type: "string",
      width: 300,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const removeProduct = async (
          id: string | number,
          status: "PENDING" | "APPROVED"
        ) => {
          try {
            setActionLoading(true);
            setSelectedRow(id);
            //THIS NEED TO FIX
            const response = await axios.delete(`${apiURL}/admin/products/${id}/`, {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            });

            if (response?.data?.success) {
              setActionLoading(false);

              refreshProducts();
              toast.success("Xóa sản phẩm thành công");
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
            id: "delete",
            title: "Xóa sản phẩm",
            onPress: () => removeProduct(params.row?.id, "APPROVED"),
            onActionSuccess: () => refreshProducts(),
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

  React.useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <MainLayout
      title="Danh sách sản phẩm "
      content={
        isLoading ? (
          <div className="w-full h-full px-8 mt-20">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-y-5">
            <div className="flex flex-row justify-between items-center">
              <div></div>
              <div className="flex flex-row gap-x-2">
                {/* <Button variant="contained" disabled={!deleteDisable}>
                  Xóa sản phẩm
                </Button> */}
                {/* <Button variant="outlined" disabled={deleteDisable}>
                  Xuất file CSV
                </Button> */}
              </div>
            </div>
            <div className="h-[700px] w-full">
              <DataGrid
                rows={products}
                columns={columns}
                pageSize={11}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
                onSelectionModelChange={(newSelectionModel) => {
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

export default ProductManagement;
