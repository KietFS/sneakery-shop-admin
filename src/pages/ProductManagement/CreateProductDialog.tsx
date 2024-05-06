import React, { useEffect, useState } from "react";

//styles
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";

import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../../designs/Button";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import SelectCustomFieldComponent from "../../components/SelectCustomField";
import { apiURL } from "../../config/constanst";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import { toast } from "react-toastify";
import UploadWidget from "../../components/UploadWidget";
import { useForm } from "react-hook-form";
import InputHookForm from "../../components/InputHookForm";
import UploadMultipleWidget from "../../components/UploadMultipleWidget";

interface ICreateProductDialogProps {
  onClose: () => void;
  open: boolean;
  onActionSucces: () => void;
}

const CreateProductDialog: React.FC<ICreateProductDialogProps> = ({
  onClose,
  open,
  onActionSucces,
}) => {
  const { user, accessToken } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const [thumbnailSelected, setThumbnailSelected] = useState<string>("");
  const [images, setImagesSelected] = useState<string[]>([]);
  const [sizes, setSizes] = useState<{ size: number; quantity: number }[]>([
    {
      size: 36,
      quantity: 1,
    },
  ]);

  const { control, getValues, handleSubmit } = useForm();

  const createProduct = async () => {
    const payload = {
      name: getValues("name"),
      category: getValues("category"),
      price: getValues("price"),
      thumbnail: thumbnailSelected,
      images: images,
      brand: getValues("brand"),
      sizes: sizes,
      description: getValues("description"),
    };
    try {
      const response = await axios.post(`${apiURL}/admin/products/`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        toast.success("Đăng sản phẩm thành công");
        onClose();
        onActionSucces();
      }
    } catch (error) {
      toast.error("Tạo sản phẩm không thành công");
      console.log("Create product error", error);
    }
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        open={open}
        className="rounded-lg"
        maxWidth="md"
        fullWidth={true}
      >
        {false ? (
          <DialogContent className="max-h-[800px]">
            <LoadingSkeleton />
          </DialogContent>
        ) : (
          <DialogContent className="max-h-[800px]">
            <div className=" px-4 py-2">
              <p className="text-gray-500 font-semibold text-xl">
                Đăng sản phẩm
              </p>
              <div className="flex flex-col gap-y-3 mt-4">
                <InputHookForm
                  control={control}
                  name="name"
                  label="Tên sản phẩm"
                  placeholder="Gõ tên sản phẩm"
                  mode="text"
                />
                <InputHookForm
                  control={control}
                  name="price"
                  label="Giá bán"
                  placeholder="Nhập giá bán"
                  mode="text"
                />
                <InputHookForm
                  control={control}
                  name="category"
                  label="Tên danh mục"
                  placeholder="Gõ tên danh mục"
                  mode="text"
                />
                <InputHookForm
                  control={control}
                  name="brand"
                  label="Tên thương hiệu"
                  placeholder="Gõ tên thương hiệu"
                  mode="text"
                />
                <InputHookForm
                  control={control}
                  name="description"
                  label="Mô tả"
                  placeholder="Nhập mô tả"
                  mode="text"
                />
                <div className="flex flex-col gap-y-2 w-full">
                  <p className="text-gray-600 font-bold text-sm">Thêm sizes</p>
                  {sizes?.map((item, index) => {
                    return (
                      <div className="flex items-center gap-x-2">
                        <input
                          className="px-2 py-1 border-gray-500 border rouned-sm w-1/2"
                          defaultValue={item.size}
                          onChange={(event) => {
                            let cloned = sizes;
                            cloned[index].size = Number(
                              event.target.value || 0
                            );
                            setSizes([...cloned]);
                          }}
                        />
                        <input
                          className="px-2 py-1 border-gray-500 border w-1/2"
                          defaultValue={item.quantity}
                          onChange={(event) => {
                            let cloned = sizes;
                            cloned[index].quantity = Number(
                              event.target.value || 0
                            );
                            setSizes([...cloned]);
                          }}
                        />
                      </div>
                    );
                  })}

                  <button
                    onClick={() => {
                      let cloned = sizes;
                      cloned.push({ size: 0, quantity: 0 });
                      setSizes([...cloned]);
                    }}
                    className="text-gray-600 text-sm font-semibold bg-gray-300 border border-gray-100 px-2 py-2 rounded-lg mt-2"
                  >
                    Thêm
                  </button>
                </div>

                <UploadWidget
                  thumbnailUploaded={thumbnailSelected}
                  setThumbnailUploaded={(image) => setThumbnailSelected(image)}
                />
                <UploadMultipleWidget
                  thumbnailUploaded={images}
                  setThumbnailUploaded={(images) => setImagesSelected(images)}
                />
              </div>
              <div className="flex flex-row-reverse mt-8">
                <Button
                  onClick={handleSubmit(createProduct)}
                  title="Đăng sản phẩm"
                  className="w-full"
                />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default CreateProductDialog;
