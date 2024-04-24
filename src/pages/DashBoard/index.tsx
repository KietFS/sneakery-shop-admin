import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useRerender } from "../../hooks/useRerender";
import MainLayout from "../../layouts/MainLayout";

export default function DashBoard() {
  const { rerender } = useRerender();

  const [lineState, setLineState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
    },
    series: [
      {
        name: "Số lượng",
        data: [7, 5, 5, 10, 30, 40, 8, 30, 41, 42, 43],
      },
    ],
  });

  const [barState, setBarState] = useState({
    options: {
      chart: {
        id: "basic-line",
      },
      xaxis: {
        categories: [
          "Puma",
          "Louis Vuiton",
          "Balenciaga",
          "Channel",
          "Adidas",
          "Nike",
          "Saint Laurent",
          "Dior",
        ],
      },
    },
    series: [
      {
        name: "Số lượng",
        data: [7, 5, 5, 10, 30, 40, 8, 5],
      },
    ],
  });

  const [pieState, setPieState] = useState({
    series: [44, 55, 13, 43, 22, 20, 30, 11],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: [
        "Puma",
        "Louis Vuiton",
        "Balenciaga",
        "Channel",
        "Adidas",
        "Nike",
        "Saint Laurent",
        "Dior",
      ],
      theme: {
        monochrome: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    rerender();
  }, []);

  return (
    <MainLayout
      title="Tổng quan thông tin của sàn"
      children={
        <div className="flex flex-col gap-y-10">
          <div className="">
            <p className="text-center text-2xl text-gray-500 font-bold mb-4">
              Doanh thu của cửa hàng theo tháng (2023)
            </p>
            <Chart
              options={lineState.options}
              series={lineState.series}
              type="line"
              width="1100"
              height="280"
            />
          </div>
          <div className="flex flex-row gap-x-5 items-center">
            <div>
              <p className="text-center text-xl text-gray-500 font-bold mb-5">
                Mức đóng góp doanh thu của các hãng
              </p>
              <Chart
                options={pieState.options as any}
                series={pieState.series}
                type="pie"
                width="400"
                height="350"
              />
            </div>
            <div>
              <p className="text-center text-xl text-gray-500 font-bold">
                Số lượng sản phẩm đang có trên sàn theo từng hãng
              </p>
              <Chart
                options={barState.options}
                series={barState.series}
                type="bar"
                width="700"
                height="250"
              />
            </div>
          </div>

          {/* <div className="">
            <Chart
              options={lineState.options}
              series={lineState.series}
              type="area"
              width="500"
            />
          </div> */}
        </div>
      }
    />
  );
}
