import React from "react";

interface ILoadingSkeletonProps {}

const LoadingSkeleton: React.FC<ILoadingSkeletonProps> = (props) => {
  return (
    <>
      {/* <div className="flex justify-between">
        <div></div>
        <div className="w-[200px] h-[50px] rounded-md animate-pulse bg-gray-200"></div>
      </div> */}
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-10"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
      <div className="w-full h-[50px] rounded-md animate-pulse bg-gray-200 mt-4"></div>
    </>
  );
};

export default LoadingSkeleton;
