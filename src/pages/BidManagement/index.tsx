import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import MainLayout from "../../layouts/MainLayout";
import { Button, Skeleton, TablePagination } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import Spinner from "../../components/Spinner";
import { apiURL } from "../../config/constanst";
import ProductBidHistoryDialog from "./BidHistoryDialog";
import LoadingSkeleton from "../../components/LoadingSkeleton";

interface IProductHomePageResponse {
  id: string;
  name: string;
  startPrice: number;
  imagePath: string;
  username: string;
}

interface IBidHistoryByProduct {}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Tên sản phẩm", width: 460 },
  {
    field: "startPrice",
    headerAlign: "left",
    align: "left",
    headerName: "Giá khởi điểm   ",
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
    field: "imagePath",
    headerName: "Hình ảnh",
    type: "string",
    width: 200,
    headerAlign: "left",
    align: "left",
    renderCell: (params: GridRenderCellParams<string>) => {
      return (
        <div className="w-[120px]">
          <img src={params.value?.split("?")[0]} width={80} height={60} />
        </div>
      );
    },
  },
  {
    field: "userName",
    headerName: "Bán bởi người dùng",
    width: 200,
  },
  {
    field: "actions",
    headerName: "Các lượt đấu giá",
    renderCell: (params: GridRenderCellParams<string>) => (
      <ViewHistoryCell id={params.row?.id as any} />
    ),
    width: 200,
  },
];

const BidManagement = () => {
  //state
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [products, setProducts] = React.useState<IProductHomePageResponse[]>(
    []
  );

  //redux
  const { user } = useAppSelector((state: IRootState) => state.auth);

  //functions
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/products?&page=0&size=9&sort=bidCreatedDate,desc`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      response && setProducts(response?.data?.data);
      response && console.log(response);
    } catch (error) {
      console.log("GET PRODUCT RESPONSE", error);
    } finally {
      setLoading(false);
    }
  };

  //effect
  React.useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <MainLayout
        title="Danh sách lượt đấu giá trên sản phẩm"
        children={
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
                  disableSelectionOnClick
                  pageSize={11}
                  rowsPerPageOptions={[10]}
                  onSelectionModelChange={(newSelectionModel) => {
                    setDeleteDisable(!deleteDisable);
                    setSelectionModel(newSelectionModel);
                  }}
                  selectionModel={selectionModel}
                />
              </div>
            </div>
          )
        }
      />
    </>
  );
};

export default BidManagement;

interface IViewHistoryCellProps {
  id: string | number;
}

const ViewHistoryCell: React.FC<IViewHistoryCellProps> = (props) => {
  const [openBidHistory, setOpenBidHistory] = React.useState<boolean>(false);
  return (
    <>
      <button className="w-[120px]" onClick={() => setOpenBidHistory(true)}>
        <p>Xem</p>
      </button>
      {openBidHistory ? (
        <ProductBidHistoryDialog
          id={props.id}
          open={openBidHistory}
          onClose={() => setOpenBidHistory(false)}
        />
      ) : null}
    </>
  );
};
