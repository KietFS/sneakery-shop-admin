import React, { useEffect, useState } from "react";

//styles
import { Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";

import {
  HandThumbDownIcon,
  InformationCircleIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import CustomFieldDialog from "./CustomFieldsDialog";
import Button from "../../designs/Button";
import { toast } from "react-toastify";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import SelectCustomFieldComponent from "../../components/SelectCustomField";

interface IPropertiesDialogProps {
  onClose: () => void;
  open: boolean;
  category: IProductCategory;
  onOpenCustomFields: (item: IProductCategoryProperty) => void;
  onUpdateFields: (params: IProductCategory, actionSuccess: () => void) => void;
}

const PropertiesDialog: React.FC<IPropertiesDialogProps> = ({
  onClose,
  open,
  category,
  onOpenCustomFields,
  onUpdateFields,
}) => {
  const [propertyValues, setPropertyValues] = useState<
    {
      name: string;
      type: string;
      options?: string[];
    }[]
  >([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>("");

  useEffect(() => {
    setPropertyValues(category?.properties || []);
  }, [category?.properties]);

  useEffect(() => {
    if (category?.name) {
      setNameValue(category?.name);
    }
  }, [category?.name]);

  const nameInputRef = React.useRef(null);

  const handleRemoveProperty = (index: number) => {
    let updatedProperties = [...propertyValues];
    updatedProperties.splice(index, 1);
    setPropertyValues(updatedProperties);
  };

  const handleAddProperty = () => {
    let updatedProperties = [...propertyValues];
    updatedProperties.push({ name: " ", type: "text", options: [] });
    setPropertyValues(updatedProperties);
  };

  const refreshProperties = async () => {
    try {
      setIsRefresh(true);
      const response = await axios.get(`${apiURL}/categories/${category.id}/`);
      if (response) {
        console.log("HERE", response?.data?.data?.properties);
        setIsRefresh(false);
        setPropertyValues(response?.data?.data?.properties);
      }
    } catch (error) {
      setIsRefresh(false);
      console.log("Error", error);
    }
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        open={open}
        className="rounded-lg"
        maxWidth="lg"
        fullWidth={true}
      >
        {isRefresh ? (
          <DialogContent className="max-h-[800px]">
            <LoadingSkeleton />
          </DialogContent>
        ) : (
          <DialogContent className="max-h-[800px]">
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
                    Quản lý danh mục
                  </h1>
                  <Tooltip onClick={onClose} title="Đóng">
                    <XMarkIcon className="w-8    h-8 p-1 hover:bg-gray-200 rounded-full cursor-pointer" />
                  </Tooltip>
                </div>

                <div>
                  <p className="font-semibold text-gray-600 text-md mb-2">
                    Tên danh mục
                  </p>
                  <input
                    placeholder="Nhập tên danh mục"
                    title="Tên danh mục"
                    defaultValue={category?.name}
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="w-full rounded-lg px-4 py-1 h-[40px] text-gray-600 font-semibold bg-gray-100 focus:border-blue-500 focus-within:border-blue-500 border-1"
                  />
                </div>

                <div className="flex flex-col mt-4">
                  <p className="font-semibold text-gray-600 text-md mb-2">
                    Các trường của danh mục
                  </p>
                  <>
                    <div
                      className="w-full flex gap-x-5 items-center px-4 py-2 rounded-t-lg bg-white border shadow-lg border-gray-300  justify-between"
                      key="header"
                    >
                      <div className="w-1/4">
                        <p className="font-semibold text-gray-600">
                          Tên trường
                        </p>
                      </div>
                      <div className="w-1/4">
                        <p className="font-semibold text-gray-600">
                          Kiểu dữ liệu
                        </p>
                      </div>
                      <div className="w-1/4">
                        <p className="font-semibold text-gray-600">
                          Các options của trường
                        </p>
                      </div>
                      <div className="w-1/4">
                        <p className="font-semibold text-gray-600">Hành động</p>
                      </div>
                    </div>
                    <>
                      {propertyValues?.length > 0 &&
                        propertyValues?.map((item: any, index: number) => (
                          <div>
                            <div className="w-full flex gap-x-5 items-center px-4 py-2 bg-white border-b border-l border-r border-gray-300  justify-between">
                              <div className="w-1/4">
                                <input
                                  ref={nameInputRef}
                                  value={propertyValues[index].name}
                                  className="pl-4 py-1 border border-gray-300 rounded-lg"
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    setPropertyValues((prevValues) =>
                                      prevValues.map((prevValue, idx) =>
                                        idx === index
                                          ? { ...prevValue, name: newValue }
                                          : prevValue
                                      )
                                    );
                                  }}
                                />
                              </div>
                              <div className="w-1/4">
                                <SelectCustomFieldComponent
                                  placeholder={`Chọn trường`}
                                  name={"type"}
                                  label={``}
                                  options={["text", "number", "boolean"]}
                                  optionSelected={propertyValues?.[index].type}
                                  onSelect={(option) => {
                                    let clonedPropertyValue = [
                                      ...propertyValues,
                                    ];
                                    clonedPropertyValue[index].type = option;
                                    setPropertyValues([...clonedPropertyValue]);
                                  }}
                                />
                              </div>
                              <div className="w-1/4 flex items-center">
                                {!category.properties[index] ? (
                                  <></>
                                ) : (
                                  <IconButton
                                    title="Xem hoặc chỉnh sửa"
                                    onClick={() => onOpenCustomFields(item)}
                                  >
                                    <PencilIcon className="text-gray-600 font-bold w-4 h-4" />
                                  </IconButton>
                                )}
                              </div>

                              <div className="w-1/4 flex items-center">
                                <IconButton
                                  title="Xem hoặc chỉnh sửa"
                                  onClick={() => handleRemoveProperty(index)}
                                >
                                  <TrashIcon className="text-gray-600 font-bold w-4 h-4" />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        ))}

                      <button className="w-full flex gap-x-5 items-center px-4 py-2 rounded-b-lg bg-white border-b border-l border-r border-gray-300  justify-center">
                        <IconButton onClick={() => handleAddProperty()}>
                          <PlusCircleIcon className="text-gray-600 font-bold w-6 h-6" />
                        </IconButton>
                      </button>
                    </>

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
                          onClick={() => {
                            onUpdateFields(
                              {
                                ...category,
                                name: nameValue,
                                properties: propertyValues,
                              },
                              refreshProperties
                            );
                          }}
                        />
                      </div>
                    </div>
                  </>
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default PropertiesDialog;
