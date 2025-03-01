export interface Order {
    orderId: string;
    startDate: string;
    salesman: string;
    company: string;
    item: string;
    model: string;
    num: number;
    expectDate: string;
    actualDate: string;
    testResult: string;
    remark: string;
    amountReceivable: number;
    amountCollected: number;
    paymentDate: string;
    changeReason: string;
    reportId: string;
  }
  
  export interface Employee {
    employeeId: string;
    employeeName: string;
    password: string;
    userType: number;
  }
  
  export interface Customer {
    id: string;
    name: string;
    remark: string;
  }
  
  export interface SalesOverview {
    orderTotalNum: number;
    orderTotalAmount: number;
    barCharts: { month: string; saleAmount: number }[];
    pieCharts: { saleName: string; orderAmount: number }[];
  }
  