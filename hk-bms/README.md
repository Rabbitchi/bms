# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


###项目结构
src/
├─ api/
│  ├─ common.ts       # 公共API配置
│  ├─ order.ts        # 订单相关API
│  ├─ employee.ts     # 员工相关API
│  └─ board.ts        # 销售概况API
├─ components/
│  ├─ layout/
│  │  ├─ Header.vue   # 保持原有内容不变
│  │  ├─ Footer.vue   # 保持原有内容不变
│  │  └─ Sidebar.vue  # 需要创建新文件
│  └─ common/
│     └─ Charts.ts    # 图表工具函数
├─ router/
│  └─ index.ts        # 路由配置
├─ views/
│  ├─ Login.vue       # 保持原有内容不变
│  ├─ SalesOverview.vue
│  ├─ OrderManagement.vue
│  ├─ EmployeeManagement.vue
│  └─ CustomerManagement.vue
└─ types/
   └─ index.ts        # 类型定义