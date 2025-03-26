# 格斗游戏搓招练习工具

主要是为了在不熟悉搓招时练习搓招，适合在没有条件打开格斗游戏时（不是每台电脑都能运行街霸 6），
可以打开工具练习一下搓招手法，目前支持 xbox 手柄（不知道是否支持 ps 手柄）、键盘、HitBox（支持 628 升龙等 HitBox 的特殊技巧）
等设备，
以及触摸屏的模拟 HitBox。

页面左边的输入历史也可以做直播时的素材，
就像一些人会把 HitBox 摇杆或者手柄的映射显示出来一样。
也可以作为手柄十字键搓招检测工具。

目前模拟的 HitBox 不能随意调整位置和大小或者加键。

## 作为 OBS 直播推流浏览器插件使用

### 如何使用：

1. 选择添加浏览器素材
2. 在浏览器设置中 URL 输入链接 "https://mengxinssfd.github.io/ftg-training/"
3. 设置宽高：最好宽度大于 1600，高度大于 800
4. 然后点击浏览器交互，点击该工具的“键盘设置”或“手柄(HitBox)设置”去绑定按键
5. 设置完毕后勾选“只显示输入历史”，然后关闭浏览器交互即可

### 键盘额外操作

手柄和 HitBox 正常用即可，但键盘由于
OBS 内非交互时不能获取键盘输入，需要额外操作:

1. 需先安装[input overlap](https://github.com/univrsal/input-overlay)插件,
2. input overlap 设置“局部特征”中勾选“启用鼠标和键盘 hook”
3. input overlap 设置“远程连接”中勾选“通过 websocket 服务器转发事件端口为“
4. 重启 OBS

参考 https://github.com/univrsal/input-overlay/tree/master/presets/input-history-windows 该文档

像哔哩哔哩直播姬这种直播 APP 要是安装不了 input overlap 的话，
那么还是用不了键盘，解决办法是把 OBS 当成哔哩哔哩直播姬的虚拟摄像头来用
