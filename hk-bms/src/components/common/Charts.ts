// src/components/common/Charts.ts
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

// 初始化趋势图表（带点击事件）
export const initTrendChart = (
  dom: HTMLElement | null, 
  barCharts: any[],
  clickHandler?: (month: number) => void
): ECharts | null => {
  if (!dom) return null;
  
  const chart = echarts.init(dom);
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const item = params[0];
        return `月份：${item.data.month}<br/>
               订单数：${item.data.orderCount}<br/>
               销售额：¥${item.data.saleAmount.toFixed(2)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: barCharts.map(item => `${item.month}月`)
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: barCharts.map(item => ({
        value: item.saleAmount,
        orderCount: item.orderCount,
        name: item.month
      })),
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => `¥${params.value.toFixed(2)}`
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }]
  };

  chart.setOption(option);

 // 绑定点击事件
 chart.on('click', (params: any) => {
  if (params.componentType === 'series') {
    const month = parseInt(params.name);
    clickHandler?.(month);
  }
});

  return chart;
}

// 初始化饼图
export const initPieChart = (
  dom: HTMLElement | null,
  pieCharts: any[],
  orderTotalAmount: number,
  orderTotalNum: number
): ECharts | null => {
  if (!dom) return null;

  const chart = echarts.init(dom);
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: ({ data }: any) => 
        `${data.saleName}<br/>
         销售额：¥${orderTotalAmount.toFixed(2)}<br/>
         占比：${((data.value / orderTotalAmount) * 100).toFixed(2)}%<br/>
         订单数：${orderTotalNum}<br/>` 
    },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      data: pieCharts.map(item => ({
        name: item.saleName,
        value: item.orderAmount,
        orderNum: item.orderNum
      })),
      label: {
        show: true,
        formatter: ({ name, percent }: any) => 
          `${name}\n${percent}%`,  // 显示名称和百分比
        position: 'outside',
        alignTo: 'edge',
        margin: 20
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}