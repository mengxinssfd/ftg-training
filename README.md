# lib-starter

npm 库初始启动模板，减少重建项时繁琐的操作

功能集成：

- pnpm
- typescript
- jest
- eslint,prettier
- commit lint
- d.ts 打包
- changelog
- rollup
- typedoc
- monorepo
  - 添加子包脚本
    - 依据提示生成项目初始 package
    - 自动添加 src，**tests**目录
    - 自动添加到 typedoc
- multirepo
- github action
  - 合并、pr 检测
  - 依赖更新检测
- 自动打包发布脚本
- gh-pages 手动发布脚本

## 使用步骤

### 1.安装依赖

项目使用的 `pnpm` 作为包管理工具，如未安装 `pnpm` 的话需要安装 `pnpm`

```shell
npm install -g pnpm
```

然后

```shell
pnpm install
```

### 2.初始化项目

依赖安装完后会自动运行仓库初始化脚本，此时只要跟着提示填写或选择选项即可完成初始化仓库。

也可以中断初始化，在需要时使用

```shell
npm run pkg:init
```

命令初始化项目

monorepo 添加 child package

```shell
npm run pkg:new
```

### 3.更新`README.md`

### 4.清空[`CHANGELOG.md`](CHANGELOG.md)

### 5.更新[`LICENSE`](LICENSE)

[`package.json`](package.json)里面有`license`, 根目录下也有个文件[`LICENSE`](LICENSE)需要更新。
