import * as echarts from "echarts";
let barChart: echarts.ECharts | null = null;

export const initBarChart = (element: HTMLElement, data: any) => {
  if (barChart) {
    barChart.dispose();
    barChart = null;
  }
  barChart = echarts.init(element);
  barChart.setOption({
    tooltip:{
      trigger: "axis",
      formatter: (params: any) => {
        const month = params[0].name; // 获取月份
        const saleAmount = params[0].value; // 获取销售额
        return `月份: ${month}<br>销售额: ${saleAmount}`; // 自定义提示框内容
      }
    },
    xAxis: {
      name: "月份",
      type: "category",
      data: data.barCharts.map((item: any) => item.month),
    },
    yAxis: {
      name: "销售额",
      type: "value",
    },
    series: [
      {
        data: data.barCharts.map((item: any) => item.saleAmount),
        type: "line",
      },
    ],
  });
  return barChart;
};
let pieChart: echarts.ECharts | null = null;
export const initPieChart = (element: HTMLElement, data: any) => {
  if (pieChart) {
    pieChart.dispose();
    pieChart = null;
  }
  pieChart = echarts.init(element);
  pieChart.setOption({
    color: [
      "#3398DB",
      "#FF9900",
      "#1E90FF",
      "#FF4500",
      "#FF8C00",
      "#B8860B",
      "#CD5C5C",
      "#483D8B",
    ],
    title: {
      text: "销售员业绩分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "销售额",
        type: "pie",
        radius: "50%",
        data: data.pieCharts.map((item: any) => ({
          name: item.saleName,
          value: item.orderAmount,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
  return pieChart;
};
