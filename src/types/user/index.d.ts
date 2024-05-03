type IRole = "ROLE_USER";

export interface IUser {
  id: string;
  username: string;
  email: string;
  roles: IRole[];
  token: string;
}

export interface IAddress {
  city: string;
  district: string;
  ward: string;
  addressDetail: string;
}

export type OrderStatusEnum =
  | 'new'
  | 'received'
  | 'processing'
  | 'shipping'
  | 'finished'
  | 'canceled';
