import React, { useEffect } from "react";
import { useAppSelector } from "../../../hooks/useRedux";
import { IRootState } from "../../../redux";
export function withAuthorization<T>(
  Component: React.FC<T>
  //   authorizations: string[],
  //   Placeholder?: React.FC
) {
  return (props: T) => {
    const { user } = useAppSelector((state: IRootState) => state.auth);
    // const index = authorizations.findIndex(
    //   (authorization) => authorization === “manager”

    return <Component {...(props as any)} />;
    // if (authorizations.length === 0 || index !== -1)
    //   return <Component {...(props as any)} />;
    // return Placeholder ? <Placeholder /> : <></>;
  };
}
