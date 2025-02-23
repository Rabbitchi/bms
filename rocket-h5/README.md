# 改造bms系统

## 项目介绍
# 使用nodejs14.15.0版本
## Project setup


```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```


### git 提交规范

ci: ci 配置文件和脚本的变动;
chore: 构建系统或辅助工具的变动;
fix: 代码 BUG 修复;
feat: 新功能;
perf: 性能优化和提升;
refactor: 仅仅是代码变动，既不是修复 BUG 也不是引入新功能;
style: 代码格式调整，可能是空格、分号、缩进等等;
docs: 文档变动;
test: 补充缺失的测试用例或者修正现有的测试用例;
revert: 回滚操作;

### 贷调

通过角色控制，用户看到的页面不同
国内（管理员）审核页面和详情页面 已审核的按钮（查看）未审核的按钮 （审核）
详情页面 同意 or 拒绝 置灰
国外（审核员）表单提交申请页面


### 角色管理和动态菜单

### 浏览器缓存


### 文件介绍

yarn.lock文件是yarn自动生成的锁定文件，里面记录了项目中各个依赖包的具体版本号，防止不同开发人员使用不同的依赖包版本导致项目运行出现问题。
vue.config.js文件是vue项目的配置文件，里面可以配置webpack等相关配置。
package.json文件是项目的配置文件，里面记录了项目的名称、版本、描述、作者、许可证、依赖包等信息。
package-lock.json文件是npm自动生成的锁定文件，里面记录了项目中各个依赖包的具体版本号，防止不同开发人员使用不同的依赖包版本导致项目运行出现问题。

jsconfig.json文件是vscode的js配置文件，里面可以配置vscode的相关配置。
babel.config.js文件是babel配置文件，里面可以配置babel的相关配置。
babel是一款JavaScript编译器，可以将ES6+的代码转换为ES5代码，以兼容更多的浏览器。
.postcssrc.js文件是postcss配置文件，里面可以配置postcss的相关配置。
postcss是一款CSS预处理器，可以对CSS进行处理，比如自动添加浏览器前缀、压缩代码、添加兼容性前缀等。
.editorconfig文件是编辑器配置文件，里面可以配置编辑器的相关配置。
.env文件是环境变量配置文件，里面可以配置环境变量，不同环境的变量配置不同。
.gitignore文件是git版本管理忽略文件，里面可以配置不需要提交的文件。
.eslintrc.js文件是eslint配置文件，里面可以配置eslint的相关配置。
eslint是一款JavaScript代码检查工具，可以检查代码的语法错误、代码风格错误等。
.prettierrc文件是prettier配置文件，里面可以配置prettier的相关配置。

.stylelintrc文件是stylelint配置文件，里面可以配置stylelint的相关配置。
stylelint是一款CSS代码检查工具，可以检查CSS代码的语法错误、代码风格错误等。
.editorconfig文件是编辑器配置文件，里面可以配置编辑器的相关配置。
.browserslistrc文件是浏览器兼容性配置文件，里面可以配置浏览器兼容性。

### 目录结构
  
src目录是项目的源码目录，里面包含了项目的主要代码。

public目录是项目的静态资源目录，里面包含了项目的图片、字体、样式等静态资源。

tests目录是项目的测试目录，里面包含了项目的测试用例。

dist目录是项目的编译输出目录，里面包含了项目的编译输出文件。

node_modules目录是项目的依赖包目录，里面包含了项目的依赖包。

src/api目录是项目的接口目录，里面包含了项目的接口文件。

src/assets目录是项目的静态资源目录，里面包含了项目的图片、字体、样式等静态资源。

src/components目录是项目的组件目录，里面包含了项目的组件文件。

src/views目录是项目的视图目录，里面包含了项目的视图文件。

src/router目录是项目的路由目录，里面包含了项目的路由文件。

src/store目录是项目的状态管理目录，里面包含了项目的状态管理文件。

src/utils目录是项目的工具目录，里面包含了项目的工具文件。

src/App.vue文件是项目的入口文件，里面包含了项目的主要逻辑。

src/main.js文件是项目的启动文件，里面包含了项目的启动逻辑。

src/permission.js文件是项目的权限文件，里面包含了项目的权限逻辑。

src/settings.js文件是项目的设置文件，里面包含了项目的设置逻辑。

### App.vue文件
