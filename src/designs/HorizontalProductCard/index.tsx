import React from "react";

interface IHorizontalProductCardProps {
  product: IProductHomePageResponse;
}

const HorizontalProductCard: React.FC<IHorizontalProductCardProps> = (
  props
) => {
  const { product } = props;
  return (
    <div className=" border-b border-gray-300 px-2 py-2 flex flex-col gap-y-5 w-full cursor-pointer hover:opacity-80">
      <div className="flex gap-x-3 items-center">
        <img src={product.imagePath} width={80} height={80} />
        <div className="flex flex-col gap-y-2">
          <p className="text-sm text-gray-600 font-semibold">{product.name}</p>

          <p className="text-xs text-gray-600">
            {product.startPrice.toString().prettyMoney()}
          </p>
          <div className="flex items-center gap-x-1">
            <p className="text-xs text-gray-600">Bán bởi:</p>
            <div className="rounded-full bg-blue-200 text-blue-800 font-semibold px-[5px] py-[2px] text-[8px] w-fit">
              {product.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalProductCard;
