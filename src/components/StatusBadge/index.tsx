
import { OrderStatusEnum } from '../../types/user';
import React from 'react';


interface IOrderStatusBadgeProps {
  status: OrderStatusEnum;
}

const OrderStatusBadge: React.FC<IOrderStatusBadgeProps> = props => {
  const {status} = props;

  const backgroundColors:any = {
    new: 'bg-gray-200',
    received: 'bg-gray-200',
    processing: 'bg-yellow-200',
    shipping: 'bg-yellow-200',
    finished: 'bg-green-200',
    canceled: 'bg-red-200',
  };

  const textColors:any = {
    new: 'text-gray-600',
    received: 'text-gray-600',
    processing: 'text-yellow-600',
    shipping: 'text-yellow-600',
    finished: 'text-green-600',
    canceled: 'text-red-600',
  };

  return (

    <div className={`py-1 px-2 rounded-md ${backgroundColors[status]  || ''}`}>
        <p className={`text-xs font-semibold ${textColors[status] || ''}`}>{status?.toUpperCase()}</p>
    </div>
  );
};

export default OrderStatusBadge;
