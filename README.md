### 说明
方便组件库迁移，从现有组件库迁移到新版组件库，辅助替换自定义前缀`<el-`开头的组件，以及语法兼容提醒

### 安装
`npm i -g compat-ui-cli`

### 使用
`jmuc -h`

```bash
Usage:
  $ jmuc upgrade

Options:
  -f, --file [file]  File path to be replaced
  -v, --version      Display version number
  -h, --help         Display this message

Examples:
   jmuc upgrade
   jmuc upgrade -f path-to-the-component.vue

```

### 功能
* [x] 支持单文件替换
* [x] 支持本地配置覆盖
* [x] 支持前缀替换
* [x] 支持自定义前端替换
* [x] 支持组件属性替换
* [x] 废弃的属性，给用户提示

### TODO

* [ ] 单元测试
* [ ] ...

