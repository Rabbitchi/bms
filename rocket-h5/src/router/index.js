import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import Layout from "@/layout";
export const constantRoutes = [
  // {
  //   path: "/redirect",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "/redirect/:path*",
  //       component: () => import("@/views/redirect/index"),
  //     },
  //   ],
  // },
  {
    path: "/",
    redirect: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  // {
  //   // path: "/detail/:id", // 使用动态路由参数来传递详情页需要的参数，比如id
  //   path: "/detail", // 使用动态路由参数来传递详情页需要的参数，比如id
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "",
  //       name: "Detail",
  //       component: () => import("@/views/detail/index"),
  //       meta: { title: "Detail", icon: "detail", affix: true },
  //     },
  //   ],
  // },
  {
    path: "/manualdetail/:id", // 使用动态路由参数来传递详情页需要的参数，比如id
    component: Layout,
    hidden: true,
    children: [
      {
        path: "",
        name: "ManualDetail",
        component: () => import("@/views/manual-detail/index"),
        meta: { title: "ManualDetail", icon: "ManualDetail", affix: true },
      },
    ],
  },
  {
    path: "/processing-case",
    component: Layout,
    // redirect: "/processing-case",
    name: "AuditManagement",
    meta: { title: "Audit Management", icon: "audit" },
    children: [
      {
        path: "processing-case",
        name: "ProcessingCase",
        component: () => import("@/views/processing-case/index"),
        meta: { title: "Processing Case", icon: "processing-case" },
      },
      {
        path: "audit-history",
        name: "AuditHistory",
        component: () => import("@/views/audit-history/index"),
        meta: { title: "Audit History", icon: "audit-history" },
      },
      {
        path: "product-factory",
        name: "ProductFactory",
        component: () => import("@/views/product-factory/index"),
        meta: { title: "Product Factory", icon: "product-factory" },
      },
      {
        path: "manual-repay",
        name: "ManualRepay",
        component: () => import("@/views/manual-repay/index"),
        meta: { title: "Manual Repay", icon: "manual-repay" },
      },
      {
        path: "sms-Template",
        name: "SmsTemplate",
        component: () => import("@/views/sms-Template/index"),
        meta: { title: "Sms Template", icon: "sms-Template" },
      },
      {
        path: "upload-download",
        name: "UploadDownload",
        component: () => import("@/views/upload-download/index"),
        meta: { title: "Upload Download", icon: "upload download" },
      },
      
    ],
  },
  // 上传下载以及短信模板
  // {
  //   path: "/new",
  //   component: Layout,
  //   // hidden: ture,
  //   redirect: "/sms-Template",
  //   name: "SMSandFILE",
  //   meta: { title: "SMSandFILE", icon: "audit" },
  //   children: [
  //     {
  //       path: "sms-Template",
  //       name: "SmsTemplate",
  //       component: () => import("@/views/sms-Template/index"),
  //       meta: { title: "Sms Template", icon: "sms-Template" },
  //     },
  //     {
  //       path: "upload-download",
  //       name: "UploadDownload",
  //       component: () => import("@/views/upload-download/index"),
  //       meta: { title: "Upload Download", icon: "upload download" },
  //     },
  //   ],
  // },
  // {
  //   path: "/new", // 使用动态路由参数来传递详情页需要的参数，比如id
  //   // hidden: true,
  //   component: Layout,
  //   // redirect: "/processing-case",
  //   name: "SMSandFILE",
  //   meta: { title: "sms file", icon: "audit" },
  //   children: [
  //     {
  //       path: "sms-Template",
  //       name: "SmsTemplate",
  //       component: () => import("@/views/sms-Template/index"),
  //       meta: { title: "Sms Template", icon: "sms-Template" },
  //     },
  //   ],
  // },
  //新开的贷调页面 角色控制，管理员可见
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/loan-adjustment",
  //   name: "LoanAdjustment",
  //   meta: { title: "Loan Adjustment", icon: "loan-adjustment" },
  //   children: [
  //     {
  //       path: "loan-auditlist",
  //       name: "LoanAuditlist",
  //       component: () => import("@/views/loan-auditlist/index"),
  //       meta: { title: "Loan Auditlist", icon: "loanauditlist" },
  //     },
  //     {
  //       path: "loan-detail",
  //       name: "LoanDetail",
  //       component: () => import("@/views/loan-detail/index"),
  //       meta: { title: "Loan Detail", icon: "LoanDetail" },
  //     },
  //   ],
  // },
];

/**
 * 将404路由拆分开，避免页面刷新后，动态路由信息丢失，直接进入404页面
 * 具体可以查看src/permission.js中的注释
 * @type {*[]}
 */
export const notFoundRoutes = [
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  { path: "*", redirect: "/404", hidden: true },
];
// 过滤菜单项，只保留有权限的菜单项
// const userPermissions = localStorage.getItem("userPermissions");

// // 将权限字符串转换为数组，如果为空，则使用空数组
// const getusermenus = userPermissions ? userPermissions.split(",") : [];
// console.log("User permissions from localStorage:", userPermissions);
// console.log("Parsed user permissions:", getusermenus);
// const filterMenuItems = (menuItems) => {
//   return menuItems.filter((menuItem) => {
//     if (menuItem.children && Array.isArray(menuItem.children)) {
//       menuItem.children = filterMenuItems(menuItem.children);
//       return menuItem.children.length > 0;
//     } else {
//       const hasTitle = menuItem.meta && menuItem.meta.title;
//       if (!hasTitle) {
//         console.warn("Missing title in menuItem.meta:", menuItem);
//       }
//       return hasTitle && getusermenus.includes(menuItem.meta.title);
//     }
//   });
// };
// const filteredMenuConfig = filterMenuItems(constantRoutes);

// // 输出过滤后的菜单配置
// console.log("filterMenuItems", filteredMenuConfig);
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
router.beforeEach((to, from, next) => {
    // 在路由更新前进行一些操作
    console.log('路由将要发生变化', to, from)
    // 继续路由导航
    next()
    // this.$router.go(0);

})


export default router;
