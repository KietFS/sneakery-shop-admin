import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import MainLayout from "../../layouts/MainLayout";

//axios
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import Spinner from "../../components/Spinner";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ActionMenu from "../../components/ActionMenu";
import { toast } from "react-toastify";
import PropertiesDialog from "./PropertiesDialog";
import CustomFieldDialog from "./CustomFieldsDialog";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useHistory } from "react-router-dom";
import CreateCategoryDialog from "./CreateCategoryDialog";

const CategoryMangement = () => {
  //state
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);

  const [categories, setCategories] = React.useState<IProductCategory[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>("");
  const [openCreateDialog, setOpenCreateDialog] =
    React.useState<boolean>(false);

  //hooks
  const { user, accessToken } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const history = useHistory();

  const handleNavigate = (id: string | number) => {
    // Chuyển hướng đến một đường dẫn cụ thể (ví dụ: "/category/123")
    history.push(`/category/${id}`);

    // Hoặc bạn có thể sử dụng biến id động
    // const categoryId = 123;
    // history.push(`/category/${categoryId}`);
  };

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data.success) {
        setCategories(response?.data?.data);
      }
    } catch (error) {
      console.log("GET PRODUCT CATEGORY ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setLoading(false);
        response && setCategories(response?.data?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log("REFRESH CATEGORY ERORR", error);
    } finally {
    }
  };

  const updateCurrentCategory = async (
    item: IProductCategory,
    onSuccess: () => void
  ) => {
    if (item.id !== null) {
      try {
        const response = await axios.put(
          `${apiURL}/categories/${item.id}`,
          item
        );
        if (response?.data?.success) {
          onSuccess();
          toast.success("Cập nhật danh mục thành công");
        } else {
          onSuccess();
          toast.success("Cập nhật danh mục thất bại");
          console.log("Update current category error");
        }
      } catch (error) {
        console.log("Errors is", error);
      }
    }
  };

  const createNewCategory = async (
    item: Omit<IProductCategory, "id">,
    onSuccess: () => void
  ) => {
    try {
      const response = await axios.post(`${apiURL}/categories/`, item);
      if (response?.data?.success) {
        onSuccess();
        refreshCategory();
        toast.success("Tạo danh mục mới thành công");
      } else {
        onSuccess();
        refreshCategory();
        toast.success("Tạo danh mục mới thất bại thất bại");
      }
    } catch (error) {
      console.log("Errors is");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Tên danh mục",
      width: 460,
      renderCell: (params) => (
        <div className="w-[100px]">
          {/* <img src={params.value?.split("?")[0]} width={80} height={60} /> */}
          <ViewHistoryCell
            category={params.row}
            onUpdateItem={(retunredParams, actionSuccess) => {
              updateCurrentCategory(retunredParams, () => {
                actionSuccess();
                refreshCategory();
              });
            }}
            onClose={() => refreshCategory()}
          />
        </div>
      ),
    },
    {
      field: "dataType",
      headerName: "Các trường",
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <div className="w-[100px]">
            {/* <img src={params.value?.split("?")[0]} width={80} height={60} /> */}
            {/* <ViewHistoryCell
              name={params?.row?.name || ""}
              categoryId={params.row?.id}
              properties={params.row.properties}
              onUpdateItem={(returnedProperties, name, actionSuccess) => {
                updateCurrentCategory(
                  {
                    id: params.row?.id,
                    name: name,
                    properties: returnedProperties,
                  },
                  () => {
                    actionSuccess();
                    refreshCategory();
                  }
                );
              }}
            /> */}
          </div>
        );
      },
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
        const removeCategory = async (id: string | number) => {
          try {
            setActionLoading(true);
            setSelectedRow(id);
            //THIS NEED TO FIX
            const response = await axios.delete(`${apiURL}/categories/${id}/`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response?.data?.success) {
              setActionLoading(false);

              refreshCategory();
              toast.success("Xóa danh mục thành công");
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
            title: "Xóa danh mục",
            onPress: () => removeCategory(params.row?.id),
            onActionSuccess: () => refreshCategory(),
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
    getAllCategories();
  }, []);

  return (
    <>
      <MainLayout
        title="Danh sách các danh mục"
        content={
          <div className="w-full flex flex-col gap-y-5">
            <div className="flex w-full justify-between">
              <div></div>
              <button
                onClick={() => setOpenCreateDialog(true)}
                className="bg-blue-500 text-white  w-fit h-[40px] px-3 py-1 font-bold rounded-lg flex items-center hover:opacity-80"
              >
                <PlusIcon className="w-[20px] h-[20px] text-white font-bold" />
                <p>Thêm danh mục</p>
              </button>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div></div>
              <div className="flex flex-row gap-x-2"></div>
            </div>
            <div className="h-[700px] w-full">
              <DataGrid
                rows={categories}
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
        }
      />

      {openCreateDialog ? (
        <CreateCategoryDialog
          onClose={() => setOpenCreateDialog(false)}
          onOpenCustomFields={() => {}}
          onCreateCategory={(params, actionSuccess) =>
            createNewCategory(params, actionSuccess)
          }
          open={openCreateDialog}
        />
      ) : null}
    </>
  );
};

export default CategoryMangement;

interface IViewCustomFieldCellProps {
  category: IProductCategory;
  onUpdateItem: (item: IProductCategory, actionSuccess: () => void) => void;
  onClose: () => void;
}

const ViewHistoryCell: React.FC<IViewCustomFieldCellProps> = (props) => {
  const [openPropertyDialog, setOpenPropertyDialog] =
    React.useState<boolean>(false);
  const [openCustomField, setOpenCustomField] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] =
    React.useState<IProductCategoryProperty | null>(null);
  const { user } = useAppSelector((state: IRootState) => state.auth);

  const { category, onUpdateItem } = props;

  const handleOpenCustomField = (item: any) => {
    setOpenCustomField(true);
    setCurrentItem(item);
  };

  return (
    <div className="flex justify-center">
      <button
        className="w-[120px] justify-start"
        onClick={() => setOpenPropertyDialog(true)}
      >
        <p className="text-left mr-10">{props.category?.name}</p>
      </button>
      {openPropertyDialog ? (
        <PropertiesDialog
          category={category}
          open={openPropertyDialog}
          onClose={() => {
            setOpenPropertyDialog(false);
          }}
          onOpenCustomFields={handleOpenCustomField}
          onUpdateFields={(fields, actionSuccess) => {
            props.onUpdateItem(fields, actionSuccess);
          }}
        />
      ) : null}

      <CustomFieldDialog
        open={openCustomField}
        onClose={() => setOpenCustomField(false)}
        onUpdateOptions={(value, actionSuccess) => {
          let cloned = category?.properties;
          category?.properties?.forEach((property, propertyIndex) => {
            if (property?.name == currentItem?.name) {
              cloned[propertyIndex].options = value;
            }
          });

          props.onUpdateItem(
            { ...category, properties: [...cloned] },
            actionSuccess
          );
          setOpenCustomField(false);
        }}
        options={currentItem?.options}
      />
    </div>
  );
};
