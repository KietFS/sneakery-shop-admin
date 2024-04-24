import React, { useEffect, useState } from "react";

//styles
import { Dialog, DialogContent, Tooltip } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { apiURL } from "../../config/constanst";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

//utils
export interface IProductBidHistoryItem {
  bidAmount: number;
  createdAt: string;
  userName: string;
  status: "SUCCESS" | "REMOVE";
}

interface IProductBidHistoryDialogProps {
  onClose: () => void;
  open: boolean;
  id: string | number;
}

const ProductBidHistoryDialog: React.FC<IProductBidHistoryDialogProps> = ({
  onClose,
  open,
  id,
}) => {
  const [bidHistory, setBidHistory] = useState<IProductBidHistoryItem[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBidHistory = async () => {
    console.log("triggered");
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiURL}/bid-history/product/${id}`);
      if (response?.data?.success) {
        setIsLoading(false);
        setBidHistory(response?.data?.data);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBidHistory();
  }, []);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      className="rounded-lg"
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogContent className="max-h-[600px]">
        {isLoading ? (
          <div>
            <h1 className="text-gray-600 font-bold text-2xl mb-4">
              Lịch sử đấu giá
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
                Lịch sử đấu giá
              </h1>
              <Tooltip onClick={onClose} title="Đóng">
                <XMarkIcon className="w-8    h-8 p-1 hover:bg-gray-200 rounded-full cursor-pointer" />
              </Tooltip>
            </div>
            <div className="flex flex-col gap-y-5">
              {!!bidHistory && bidHistory?.length > 0 ? (
                <>
                  {" "}
                  {bidHistory?.map((item, index) => (
                    <div
                      className="w-full flex gap-x-5 items-center px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-lg justify-between"
                      key={index.toString()}
                    >
                      <p className="text-lg text-gray-500 font-bold">
                        {item.userName}
                      </p>
                      <p className="text-blue-500 font-bold text-sm cursor-pointer mr-1 ">
                        {item.bidAmount.toString().prettyMoney()}$
                      </p>
                      <p className="text-gray-600 text-sm cursor-pointer">
                        {item.createdAt.toString().replace("T", " ")}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex items-center">
                  <InformationCircleIcon width={20} height={20} />
                  <p className="ml-2">Sản phẩm chưa được đấu giá</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductBidHistoryDialog;
