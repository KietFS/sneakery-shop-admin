import React from "react";

interface IPaginationProps {
  onChangePage: (page: number) => void;
  totalSize: number;
  currentPage: number;
  limit?: number;
}

const Pagination: React.FC<IPaginationProps> = ({
  onChangePage,
  totalSize,
  currentPage,
  limit = 10,
}) => {
  return (
    <div className="flex w-full justify-between px-10">
      <div></div>
      <div className="flex">
        {Array.from(
          { length: Math.round(totalSize / limit) },
          (_, index) => index
        )?.map((page, pageIndex) => (
          <div className="px-2 py-1 rounded-md border-gray-100 border mr-2 text-center justify-center">
            <p>{page + 1}</p>{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
