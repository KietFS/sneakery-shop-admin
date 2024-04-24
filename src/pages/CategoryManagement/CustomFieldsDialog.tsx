import React, { useEffect, useState } from "react";

//styles
import { Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import {
  InformationCircleIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../../designs/Button";

interface ICustomFieldDialogProps {
  onClose: () => void;
  open: boolean;
  options?: string[];
  onUpdateOptions: (value: string[], actionSuccess: () => void) => void;
}

const CustomFieldDialog: React.FC<ICustomFieldDialogProps> = ({
  onClose,
  open,
  options,
  onUpdateOptions,
}) => {
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if (!!options && options?.length > 0) {
      setValues(options);
    } else {
      setValues([]);
    }
  }, [options]);

  const handleCreateNewOption = () => {
    let clonedValues = [...values]; // Tạo một bản sao của mảng values
    clonedValues.push("");
    setValues([...clonedValues]);
  };

  const handleConfirmUpdate = () => {
    onUpdateOptions(values, () => {});
    onClose();
  };

  const handleRemoveOption = (index: number) => {
    let clonedValues = [...values]; // Tạo một bản sao của mảng values
    clonedValues.splice(index, 1); // Loại bỏ phần tử tại index
    setValues(clonedValues);
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      className="rounded-lg"
      maxWidth="xs"
      key={`property-dialog`}
      fullWidth={true}
    >
      <DialogContent className="max-h-[900px]">
        {false ? (
          <div>
            <h1 className="text-gray-600 font-bold text-2xl mb-4">
              Quản lý các trường của danh mục
            </h1>
            <div className="w-full h-[40px] bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-full h-[40px] bg-gray-200 rounded-lg animate-pulse mt-4"></div>
            <div className="w-full h-[40px] bg-gray-200 rounded-lg animate-pulse mt-4"></div>
            <div className="w-full h-[40px] bg-gray-200 rounded-lg animate-pulse mt-4"></div>
            <div className="w-full h-[40px] bg-gray-200 rounded-lg animate-pulse mt-4"></div>
            <div className="w-full h-[40px] bg-gray-200 rounded-lg animate-pulse mt-4"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-600 font-bold text-2xl mb-2">
                Quản lý các trường của danh mục
              </h1>
              <Tooltip onClick={onClose} title="Đóng">
                <XMarkIcon className="w-8    h-8 p-1 hover:bg-gray-200 rounded-full cursor-pointer" />
              </Tooltip>
            </div>
            <div className="flex flex-col gap-y-5">
              {!!values && values?.length > 0 ? (
                <>
                  <div
                    className="w-full flex gap-x-5 items-center px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-lg justify-between"
                    key="header"
                  >
                    <div className="w-1/2">
                      <p>Trường</p>
                    </div>
                    <div className="w-1/2 flex flex-row-reverse">
                      <p>Hành động</p>
                    </div>
                  </div>
                  {values?.map((item, index) => (
                    <div
                      className="w-full flex gap-x-5 items-center px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-lg justify-between"
                      key={index.toString()}
                    >
                      <div className="w-1/2">
                        <input
                          className="pl-4 py-1 border border-gray-300 rounded-lg"
                          defaultValue={item}
                          value={values?.[index]}
                          onChange={(text) => {
                            let clonedValues = values;
                            clonedValues[index] = text.target.value;
                            setValues([...clonedValues]);
                          }}
                        />
                      </div>
                      <div className="w-1/2 flex items-center flex-row-reverse">
                        <button
                          onClick={() => {
                            handleRemoveOption(index);
                          }}
                        >
                          <TrashIcon className="text-gray-600 font-bold w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex items-center">
                  <InformationCircleIcon width={20} height={20} />
                  <p className="ml-2">Không có giá trị nào để hiển thị</p>
                </div>
              )}
              <div className="w-full flex justify-center">
                <IconButton onClick={handleCreateNewOption}>
                  <PlusCircleIcon className="w-6 h-6 text-gray-500" />
                </IconButton>
              </div>
            </div>

            <div className="flex justify-between w-full mt-8">
              <div></div>
              <div className="flex gap-x-2">
                <Button
                  variant="secondary"
                  title="Đóng"
                  onClick={() => onClose()}
                />
                <Button
                  title="Cập nhật"
                  onClick={() => handleConfirmUpdate()}
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomFieldDialog;
