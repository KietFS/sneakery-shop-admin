import dayjs from "dayjs";

String.prototype.truncate = function (num: number) {
  if (this.length > num) {
    return (this.slice(0, num) + "...") as string;
  } else {
    return this as string;
  }
};

String.prototype.prettyMoney = function (hideSymbol?: boolean) {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(Number(this));
};

String.prototype.prettyDate = function () {
  return dayjs(String(this)).format("DD/MM/YYYY");
};

Array.prototype.has = function (item) {
  if (!isEqualNoop) throw new Error("Missing isEqualKey!");
  return this.some((currentItem) => isEqualNoop(item, currentItem));
};

const isEqualNoop = (a: any, b: any) => {
  return a?.id === b?.id;
};

export { isEqualNoop as isEqual };
