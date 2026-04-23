---
abbrlink: ''
categories:
- - Linux
date: '2026-04-23T20:24:41.301549+08:00'
excerpt: RHCSA 详细学习计划  适用对象：已经有一定 Linux / 服务器实战经验，正在系统化学习 RHEL / RHCSA 的学习者 目标版本：RHEL 10 / EX200 思路 使用方法：按周推进；每天固定遵循 输入 → 实操 → 复盘 → 验证 四段式；所有配置都要 验证，关键项都要 重启验证  学习总规则 第一段：输入 20 到 30 分钟 看官方文档、课程目录、简短视频、你自己的旧笔记 ...
tags:
- RHCSA
- 学习
title: ' RHCSA 详细学习计划'
updated: '2026-04-23T20:25:53.913+08:00'
---
# RHCSA 详细学习计划

> 适用对象：已经有一定 Linux / 服务器实战经验，正在系统化学习 RHEL / RHCSA 的学习者
> 目标版本：RHEL 10 / EX200 思路
> 使用方法：按周推进；每天固定遵循 **输入 → 实操 → 复盘 → 验证** 四段式；所有配置都要 **验证**，关键项都要 **重启验证**

## 学习总规则

### 第一段：输入

20 到 30 分钟
看官方文档、课程目录、简短视频、你自己的旧笔记

### 第二段：实操

60 到 120 分钟
必须上虚拟机做
每个命令至少自己打 3 次，不复制粘贴

### 第三段：复盘

10 到 20 分钟只记：

- 常用命令
- 常见报错

### 第四段：验证

10 到 20 分钟

凡是服务、挂载、网络、firewalld、SELinux、timer、容器等配置，至少做一次：

- 当前会话验证
- 重启后验证

## 标准操作步骤

### 环境搭建

> **目标**
> 把实验环境搭成能长期训练的状态

#### 配套资料

官方主线

- EX200：红帽认证系统管理员考试（RHCSA）
  [https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam](https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam)
- RH199：红帽认证系统管理员快速提升课程
  [https://www.redhat.com/zh-cn/services/training/rh199-red-hat-certified-system-administrator-rapid-track-course](https://www.redhat.com/zh-cn/services/training/rh199-red-hat-certified-system-administrator-rapid-track-course)
- RHEL 10 官方文档总目录（中文）
  [https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10)

环境与实验

- No-cost RHEL 下载（官方）
  [https://developers.redhat.com/products/rhel/download](https://developers.redhat.com/products/rhel/download)
- Red Hat Developer Sandbox
  [https://developers.redhat.com/developer-sandbox](https://developers.redhat.com/developer-sandbox)
- RHEL Interactive Labs
  [https://www.redhat.com/en/interactive-labs/enterprise-linux](https://www.redhat.com/en/interactive-labs/enterprise-linux)

速查

- RHEL 10 Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet](https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet)
- Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/linux-commands-cheat-sheet](https://developers.redhat.com/cheat-sheets/linux-commands-cheat-sheet)

这一节建议重点查

- 安装 RHEL
- SSH
- `dnf`
- `systemctl`
- `journalctl`
- `hostnamectl`

#### 安装虚拟机

```shell
RHEL 10 Minimal
8 vCPU
16 GB RAM
512 GB 磁盘
开启 SSH
启动 firewalld
创建 student 用户
配 wheel
```

#### 初始化系统

```shell
修改主机名
更新系统
安装基础工具
建练习目录
```

#### 做快照

```shell
fresh-install
clean-base
before-weekly-lab
```

#### 通过标准

- 能从宿主机 SSH 登录
- 会 `dnf install`
- 会 `systemctl status/start/stop/restart/enable/disable`
- 会 `journalctl -u 服务名`
- 会建用户并给 sudo

## 命令行基础 + 文件搜索与文本处理

> **目标**
> 练到看到一个需求，能立刻想到用 find、grep、管道去解决

### 配套资料

官方主线

- RH124：红帽系统管理一
  [https://www.redhat.com/zh-cn/services/training/rh124-red-hat-system-administration-i](https://www.redhat.com/zh-cn/services/training/rh124-red-hat-system-administration-i)
- Learn Linux（Developer 官方学习入口）
  [https://developers.redhat.com/learn/linux](https://developers.redhat.com/learn/linux)

速查

- Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/linux-commands-cheat-sheet](https://developers.redhat.com/cheat-sheets/linux-commands-cheat-sheet)
- Intermediate Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet](https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet)
- Advanced Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/advanced-linux-commands](https://developers.redhat.com/cheat-sheets/advanced-linux-commands)

本机文档建议

```shell
man find
man grep
man cut
man tr
man ln
info coreutils
ls /usr/share/doc
```

### 必学命令

```shell
pwd
cd
ls
cp
mv
rm
mkdir
touch
cat
less
head
tail
wc
sort
uniq
cut
tr
grep
find
locate
which
whereis
file
ln
man
info
```

### 必学资料入口

```shell
/usr/share/doc
```

### Day 1

```shell
pwd
cd
ls
mkdir
touch
cp
mv
rm
```

练习：

```shell
建 3 级目录
复制、移动、重命名文件
删除文件和目录
```

通过标准：

```shell
不查资料能完成基本目录操作
```

### Day 2

```shell
cat
less
head
tail
wc
file
```

练习：

```shell
查看 /etc/passwd
看前 5 行、后 5 行
统计行数
判断不同文件类型
```

通过标准：

```shell
知道什么时候用 cat，什么时候用 less
```

### Day 3

```shell
grep
grep -i
grep -v
grep -r
```

练习：

```shell
grep root /etc/passwd
grep -i ssh /etc/services
grep -v nologin /etc/passwd
grep -r sshd /etc
```

通过标准：

```shell
能用 grep 查内容、过滤内容
```

### Day 4

```shell
find
-name
-type
-size
-user
```

练习：

```shell
find /etc -name "*.conf"
find /var/log -type f
find /home -user student
find /tmp -size +1M
```

通过标准：

```shell
能按名字、类型、用户、大小找文件
```

### Day 5

```shell
管道
重定向
sort
uniq
cut
tr
ln
ln -s
```

练习：

```shell
cat /etc/passwd | grep bash
grep bash /etc/passwd | wc -l
cut -d: -f1 /etc/passwd
创建一个硬链接
创建一个软链接
删除原文件后观察差异
修改原文件内容观察差异
```

通过标准：

```shell
会把多个命令串起来解决问题
知道硬链接和软链接的区别，能根据题目选择
```

### Day 6

练习：

```shell
用 man 查 chmod
用 man 查 tar
用 info 查 coreutils
去 /usr/share/doc 下找某个软件的文档
```

整合练习：

- 找出 `/etc` 下所有 `.conf`
- 找出 `/var/log` 里包含 `error` 的行
- 统计当前系统可登录用户数量
- 找出所有属于 `root` 的普通文件

### Day 7

复盘：

- 自己手写 20 条 `find`
- 自己手写 20 条 `grep`
- 整理一页命令模板

## 归档、压缩、解压

> **目标**
> 把 tar 和常见压缩操作练熟，做到看到需求能立刻打出正确命令

### 配套资料

官方主线

- EX200：考试目标
  [https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam](https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam)
- RH134：红帽系统管理二
  [https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii](https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii)

速查

- Advanced Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/advanced-linux-commands](https://developers.redhat.com/cheat-sheets/advanced-linux-commands)

本机文档建议

```shell
man tar
man gzip
man bzip2
man xz
```

### 必学命令

```shell
tar
gzip
gunzip
bzip2
bunzip2
xz
unxz
zip
unzip
file
du -sh
```

### Day 1

```shell
tar 基础
-c
-x
-v
-f
```

练习：

```shell
创建一个目录 testdir
放几个文件进去
打成 test.tar
解压到新目录验证
```

### Day 2

```shell
tar + gzip
-z
gzip
gunzip
```

练习：

```shell
把目录打成 test.tar.gz
解压 test.tar.gz
比较压缩前后体积
```

### Day 3

```shell
tar + bzip2
-j
bzip2
bunzip2
```

练习：

```shell
把目录打成 test.tar.bz2
解压 test.tar.bz2
观察压缩体积差异
```

### Day 4

```shell
xz
-J
```

练习：

```shell
把目录打成 test.tar.xz
解压 test.tar.xz
对比 gzip 和 xz 的效果
```

### Day 5

```shell
查看归档内容
tar -tf
指定目录解压
tar -xf -C
```

练习：

```shell
不解压先看归档里有哪些文件
把归档解压到 /tmp/restore
只解压其中一个文件
```

### Day 6

整合练习：

- 把 `/etc` 某几个配置文件打成归档
- 用 `gzip` 压缩日志文件
- 把归档解压到指定目录
- 验证文件内容和权限是否正常

### Day 7

复盘：

- 整理 `tar` 常用参数模板
- 整理 `tar.gz / tar.bz2 / tar.xz` 模板
- 整理常见报错和排查思路

## 软件包、仓库、RPM 管理

> **目标**
> 把 RHEL 软件管理练熟，做到会查、会装、会删、会看包内容、会从本地文件安装

### 配套资料

官方主线

- 使用 DNF 工具管理软件（RHEL 10）
  [https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10/html-single/managing_software_with_the_dnf_tool/index](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10/html-single/managing_software_with_the_dnf_tool/index)
- DNF 配置章节（英文）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/managing_software_with_the_dnf_tool/configuring-dnf](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/managing_software_with_the_dnf_tool/configuring-dnf)
- RHEL Interactive Labs：Install software using package managers
  [https://www.redhat.com/en/interactive-labs/enterprise-linux](https://www.redhat.com/en/interactive-labs/enterprise-linux)

本机文档建议

```shell
man dnf
man rpm
```

### 必学命令

```shell
dnf
dnf repolist
dnf search
dnf info
dnf install
dnf remove
dnf history
rpm -q
rpm -qi
rpm -ql
rpm -qf
```

### Day 1

```shell
dnf repolist
dnf search
dnf info
```

练习：

```shell
查看当前可用仓库
搜索 httpd
查看 httpd 的包信息
搜索 tmux、rsync、podman
```

通过标准：

```shell
知道怎么查包、看包描述、看来源
```

### Day 2

```shell
dnf install
dnf remove
dnf list installed
```

练习：

```shell
安装 tmux
安装 rsync
删除一个测试包
验证是否安装成功
```

通过标准：

```shell
会安装、卸载、验证软件包
```

### Day 3

```shell
rpm -q
rpm -qi
rpm -ql
rpm -qf
dnf install ./package.rpm
```

练习：

```shell
查看 bash 是否安装
查看 bash 包信息
查看 bash 包安装了哪些文件
反查 /usr/bin/ls 属于哪个包
准备一个本地 rpm 文件
尝试用 dnf 从本地文件安装
```

通过标准：

```shell
会用 rpm 查包、查文件归属、查安装内容
知道从本地文件安装时优先用 dnf
```

### Day 4

```shell
dnf history
dnf reinstall
cat /etc/yum.repos.d/*.repo
dnf repolist
```

练习：

```shell
查看最近安装历史
重装一个测试包
看安装前后变化
```

通过标准：

```shell
从本地文件系统安装一个 rpm
安装前先查看包名和版本
安装后验证命令可用
卸载并重新安装
```

### Day 5

整合练习：

- 从仓库安装一个包
- 从本地 rpm 文件安装一个包
- 用 rpm 查询包内容与文件归属
- 删除并重新安装
- 重启后验证命令仍可用

### Day 6

复盘：

- 整理 `dnf` 常用命令模板
- 整理 `rpm` 查询模板
- 整理“查不到命令 / 查不到文件归属 / 安装失败”排障模板

### Day 7

缓冲 / 补漏：

- 把前面不会的包管理命令再手打一遍
- 补齐自己的常用软件安装清单

## 用户、组、权限、ACL

> **目标**
> 把 Linux 权限模型练熟，这周是 RHCSA 地基

### 配套资料

官方主线

- RH124：课程内容摘要
  [https://www.redhat.com/zh-cn/services/training/rh124-red-hat-system-administration-i](https://www.redhat.com/zh-cn/services/training/rh124-red-hat-system-administration-i)
- 在 RHEL 中配置身份验证和授权（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_authentication_and_authorization_in_rhel/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_authentication_and_authorization_in_rhel/index)

速查

- Intermediate Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet](https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet)
- Advanced Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/advanced-linux-commands](https://developers.redhat.com/cheat-sheets/advanced-linux-commands)

本机文档建议

```shell
man useradd
man usermod
man passwd
man chage
man chmod
man chown
man setfacl
man getfacl
man sudoers
```

### 必学命令

```shell
useradd
usermod
userdel
passwd
groupadd
groupmod
id
groups
chown
chgrp
chmod
umask
getfacl
setfacl
chage
sudo -l
visudo
```

### Day 1

```shell
cat /etc/passwd
cat /etc/group
useradd
passwd
id
groups
```

练习：

```shell
建 3 个用户
给不同密码
查看 UID/GID
```

### Day 2

```shell
groupadd
usermod -aG
```

练习：

```shell
建 devops、ops
把不同用户加到不同组
```

### Day 3

```shell
权限位
chmod
chown
chgrp
```

练习：

```shell
建目录 /shared
不同用户访问同一目录
反复改权限观察效果
```

### Day 4

```shell
umask
```

练习：

```shell
不同 umask 下创建文件和目录
观察默认权限
```

### Day 5

```shell
ACL
setfacl
getfacl
chage
passwd -e
chage -l
```

练习：

```shell
setfacl -m u:alice:rwx /shared
getfacl /shared
setfacl -x u:alice /shared
查看某用户密码有效期
设置密码最短和最长有效期
强制用户下次登录修改密码
```

### Day 6

```shell
sudo -l
visudo
```

练习：

```shell
查看某用户当前 sudo 权限
给 wheel 或指定用户授权
用 sudo -l 验证授权结果
```

整合练习：

- 建 3 个用户、2 个组
- 给共享目录设置属主、属组、权限、ACL
- 让某个用户能写，另一个只能读
- 给某用户配置 sudo 权限并验证

### Day 7

复盘：

- 自己画一张权限模型图

整理：

- 用户管理模板
- 权限修改模板
- ACL 操作模板
- 密码老化模板
- sudo 验证模板

## 进程、systemd、日志、任务调度

> **目标**
> 把服务和进程这块做扎实

### 配套资料

官方主线

- 使用 systemd 单元文件自定义和优化您的系统（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/using_systemd_unit_files_to_customize_and_optimize_your_system/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/using_systemd_unit_files_to_customize_and_optimize_your_system/index)
- RH199：课程大纲
  [https://www.redhat.com/zh-cn/services/training/rh199-red-hat-certified-system-administrator-rapid-track-course](https://www.redhat.com/zh-cn/services/training/rh199-red-hat-certified-system-administrator-rapid-track-course)

速查

- Intermediate Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet](https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet)
- Advanced Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/advanced-linux-commands](https://developers.redhat.com/cheat-sheets/advanced-linux-commands)

本机文档建议

```shell
man ps
man pgrep
man kill
man nice
man systemctl
man journalctl
man crontab
man at
```

### 必学命令

```shell
ps
top
pgrep
pkill
kill
killall
nice
renice
jobs
bg
fg
nohup
systemctl
journalctl
crontab
at
```

### Day 1

```shell
ps
top
pgrep
```

练习：

```shell
找 sshd 进程
找 root 运行的进程
看 CPU / 内存占用
```

### Day 2

```shell
kill
pkill
killall
```

练习：

```shell
启动 sleep 300
定位 PID
杀掉它
```

### Day 3

```shell
nice
renice
nohup
jobs
bg
fg
```

练习：

```shell
后台运行命令
改优先级
退出终端后保留进程
```

### Day 4

```shell
systemctl
enable
disable
restart
status
```

练习：

```shell
管理 sshd
管理 firewalld
```

### Day 5

```shell
journalctl
```

练习：

```shell
journalctl -b
journalctl -u sshd
journalctl -xe
```

### Day 6

```shell
crontab
at
```

练习：

- 写一个每分钟执行的 cron
- 安排一个 5 分钟后执行的任务

### Day 7

复盘整合：

- 找进程
- 杀进程
- 改优先级
- 起停服务
- 看日志
- 配定时任务

## Shell 脚本基础

> **目标**
> 把 shell 脚本练到能写简单自动化，不靠手工重复敲命令

### 配套资料

官方主线

- RH134：课程内容摘要（shell 脚本、自动化）
  [https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii](https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii)
- Bash Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/bash-shell-cheat-sheet](https://developers.redhat.com/cheat-sheets/bash-shell-cheat-sheet)

补充

- Learn Linux
  [https://developers.redhat.com/learn/linux](https://developers.redhat.com/learn/linux)

本机文档建议

```shell
help test
help read
help for
help while
help case
man bash
```

### 必学命令

```shell
bash
echo
read
test
[ ]
[[ ]]
if
for
while
case
chmod +x
source
export
```

### Day 1

```shell
脚本基本结构
#!/bin/bash
echo
chmod +x
bash script.sh
./script.sh
```

练习：

```shell
写第一个 hello.sh
输出当前用户名
输出当前日期
输出当前主机名
```

### Day 2

```shell
变量
位置参数
$1
$2
$#
$@
```

练习：

```shell
写脚本接收用户名参数
输出参数个数
输出所有参数
不传参数时报错提示
```

### Day 3

```shell
read
交互输入
test
[ ]
文件判断
字符串判断
数字判断
```

练习：

```shell
写脚本询问一个目录名
判断目录是否存在
存在就提示 yes
不存在就提示 no
```

### Day 4

```shell
if
elif
else
```

练习：

```shell
写脚本判断一个服务是否运行
运行则输出 running
未运行则输出 stopped
```

### Day 5

```shell
for
while
```

练习：

```shell
用 for 批量创建 5 个用户
用 while 输出 1 到 10
批量检查多个文件是否存在
```

### Day 6

整合练习：

- 写一个脚本批量检查多个服务状态
- 写一个脚本批量创建目录
- 写一个脚本统计 /etc 下 .conf 文件数量
- 写一个脚本检查磁盘使用率并输出提示

### Day 7

复盘：

- 自己手写 5 个小脚本
- 整理脚本模板
- 整理变量、判断、循环模板

## systemd timer 专项

> **目标**
> 把定时任务从 cron / at 扩展到 systemd timer，做到会写、会启、会查、会排障

### 配套资料

官方主线

- 使用 systemd 单元文件自定义和优化您的系统（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_systemd_unit_files_to_customize_and_optimize_your_system/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_systemd_unit_files_to_customize_and_optimize_your_system/index)
- RH134：课程内容摘要
  [https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii](https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii)

本机文档建议

```shell
man systemd.timer
man systemd.service
man systemctl
```

### 必学命令

```shell
systemctl
journalctl
systemd-analyze
systemctl list-timers
daemon-reload
enable
start
status
cat
tee
```

### Day 1

```shell
timer 概念
.service
.timer
systemctl list-timers
```

练习：

```shell
查看系统已有 timer
看几个常见 timer 的状态
区分 service 和 timer 的关系
```

### Day 2

```shell
写最简单的 oneshot service
```

练习：

```shell
写一个 myecho.service
执行后把当前时间写入日志文件
手动 systemctl start 验证
```

### Day 3

```shell
写最简单的 timer
OnCalendar
```

练习：

```shell
写一个 myecho.timer
每分钟触发一次 myecho.service
启动并观察效果
```

### Day 4

```shell
OnBootSec
OnUnitActiveSec
Persistent
```

练习：

```shell
写一个开机 1 分钟后执行的 timer
写一个每 5 分钟重复执行的 timer
观察 Persistent 的效果
```

### Day 5

```shell
daemon-reload
enable --now
status
journalctl -u
```

练习：

```shell
修改 timer 后重新加载
设置开机启动
查看 timer 状态
查看 service 日志
```

### Day 6

整合练习：

- 写一个定时清理临时文件的 service + timer
- 写一个定时记录磁盘使用率的 service + timer
- 设置开机自动生效
- 重启后验证是否仍然有效

### Day 7

复盘：

- 整理 service 模板
- 整理 timer 模板
- 整理 timer 排障模板

## 磁盘、文件系统、挂载、fstab

> **目标**
> 从“会看磁盘”升级到“会真正管理存储”

### 配套资料

官方主线

- 管理文件系统（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/managing_file_systems/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/managing_file_systems/index)
- 管理存储设备（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/managing_storage_devices/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/managing_storage_devices/index)

速查

- Advanced Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/advanced-linux-commands](https://developers.redhat.com/cheat-sheets/advanced-linux-commands)

本机文档建议

```shell
man lsblk
man blkid
man fdisk
man parted
man mkfs.xfs
man mkfs.ext4
man mkfs.vfat
man mount
man fstab
man swapon
```

### 必学命令

```shell
lsblk
blkid
fdisk
parted
mkfs.xfs
mkfs.ext4
mkfs.vfat
mount
umount
df -h
du -sh
mkswap
swapon
swapoff
showmount
```

### Day 1

```shell
lsblk
blkid
df -h
du -sh
```

练习：

```shell
看现有磁盘
看文件系统类型
看目录占用
```

### Day 2

```shell
fdisk
parted
```

练习：

```shell
给 VM 加一块新盘
看系统能否识别
```

### Day 3

```shell
mkfs.xfs
mkfs.ext4
mount
umount
```

练习：

```shell
新建文件系统
挂到 /data
卸载再挂载
```

### Day 4

```shell
/etc/fstab
blkid
cat /etc/fstab
```

练习：

```shell
使用 UUID 或 LABEL 写入 /etc/fstab
做开机自动挂载
重启验证
```

### Day 5

```shell
mkswap
swapon
swapoff
mkfs.vfat
blkid
```

练习：

```shell
新建 swap 分区或 swap 文件
启用和停用
准备一个测试分区
格式化成 vfat
挂载到 /mnt/vfatlab
卸载并重新挂载
```

### Day 6

```shell
mount -t nfs
umount
showmount
autofs
systemctl status autofs
systemctl restart autofs
```

练习：

```shell
挂载一个 NFS 共享到 /mnt/nfs
验证读写或只读效果
卸载 NFS 共享
安装 autofs
配置一个自动挂载点
访问目录触发挂载
等待空闲后观察自动卸载
```

### Day 7

整合练习：

- 新加磁盘
- 创建分区
- 创建文件系统
- 挂载到 /data
- 使用 UUID 或 LABEL 写进 fstab
- 重启验证

复盘：

- 默写挂载流程
- 默写 fstab 关键字段
- 整理磁盘排障笔记

## LVM 专项周

> **目标**
> 把 LVM 练成肌肉记忆

### 配套资料

官方主线

- 配置和管理逻辑卷（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_and_managing_logical_volumes/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_and_managing_logical_volumes/index)
- LVM 基础逻辑卷管理章节
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/configuring_and_managing_logical_volumes/basic-logical-volume-management](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/configuring_and_managing_logical_volumes/basic-logical-volume-management)

本机文档建议

```shell
man pvcreate
man vgcreate
man lvcreate
man pvs
man vgs
man lvs
man lvextend
```

### 必学命令

```shell
pvcreate
vgcreate
lvcreate
pvs
vgs
lvs
lvextend
vgextend
pvdisplay
vgdisplay
lvdisplay
```

### Day 1

```shell
PV / VG / LV 概念
```

练习：

```shell
看图理解结构
复述一遍 PV / VG / LV 关系
```

### Day 2

练习：

```shell
pvcreate /dev/sdb
vgcreate vgdata /dev/sdb
lvcreate -L 2G -n lvdata vgdata
```

### Day 3

练习：

```shell
格式化 LV
挂载 LV
写进 fstab
```

### Day 4

练习：

```shell
扩容 LV
扩展文件系统
```

### Day 5

练习：

```shell
再加一块盘
vgextend
新建第二个 LV
```

### Day 6

整合练习：

- 从空盘开始，完整做一遍 `PV → VG → LV → 文件系统 → 挂载 → 开机挂载`

### Day 7

复盘：

- 把完整流程写成 10 行以内命令清单

## 网络、SSH、SCP、SFTP、firewalld

> **目标**
> 把远程管理和防火墙做稳

### 配套资料

官方主线

- 配置和管理网络（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_and_managing_networking/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_and_managing_networking/index)
- 配置防火墙和数据包过滤器（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_firewalls_and_packet_filters/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_firewalls_and_packet_filters/index)
- 配置时间同步（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_time_synchronization/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/configuring_time_synchronization/index)

速查

- Intermediate Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet](https://developers.redhat.com/cheat-sheets/intermediate-linux-commands-cheat-sheet)
- Advanced Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/advanced-linux-commands](https://developers.redhat.com/cheat-sheets/advanced-linux-commands)

本机文档建议

```shell
man nmcli
man ip
man ssh
man scp
man sftp
man firewall-cmd
man firewalld
man timedatectl
man chronyc
```

### 必学命令

```shell
ip
nmcli
ping
ss
hostnamectl
scp
sftp
firewall-cmd
getent
timedatectl
chronyc
```

### Day 1

```shell
ip a
ip route
ping
ss -tlnp
```

### Day 2

```shell
SSH 基础
scp
sftp
```

练习：

```shell
主机间传文件
远程拉文件、推文件
```

### Day 3

```shell
firewalld
运行时规则
永久规则
```

### Day 4

练习：

```shell
firewall-cmd --list-all
firewall-cmd --add-service=http
firewall-cmd --permanent --add-service=http
firewall-cmd --reload
```

### Day 5

```shell
nmcli
ip -6 a
ip -6 route
getent hosts
cat /etc/hosts
hostnamectl
```

练习：

```shell
放行端口
删除规则
看 zone
查看本机 IPv6 地址
给测试连接配置 IPv6
验证 IPv6 路由
修改 /etc/hosts
用 getent hosts 验证主机名解析
```

### Day 6

```shell
timedatectl
chronyc
systemctl status chronyd
```

练习：

```shell
查看当前时区
查看当前时间同步状态
确认 chronyd 是否运行
修改时区后再验证
```

### Day 7

整合练习：

- 配 SSH
- 传文件
- 起一个服务
- 防火墙放行
- 验证连通性

复盘：

- 整理 firewalld 模板
- 整理 SSH / SCP / SFTP 模板
- 整理 IPv6 / hosts / chronyd 模板

## 启动流程、target、救援模式

> **目标**
> 把启动相关操作练熟，做到会切 target，会进救援，会做最基础启动排障

### 配套资料

官方主线

- 使用 systemd 单元文件自定义和优化您的系统（RHEL 10）
  [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/using_systemd_unit_files_to_customize_and_optimize_your_system/index](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html-single/using_systemd_unit_files_to_customize_and_optimize_your_system/index)
- RH134：课程内容摘要（启动流程与故障排除）
  [https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii](https://www.redhat.com/zh-cn/services/training/rh134-red-hat-system-administration-ii)
- EX200：考试目标
  [https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam](https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam)

本机文档建议

```shell
man systemctl
man journalctl
man grubby
```

### 必学命令

```shell
systemctl get-default
systemctl set-default
systemctl isolate
systemctl rescue
systemctl emergency
reboot
journalctl -b
cat /proc/cmdline
grubby --info=ALL
grubby --default-kernel
grub2-editenv list
```

### Day 1

```shell
target 概念
multi-user.target
graphical.target
rescue.target
emergency.target
```

练习：

```shell
查看当前默认 target
区分 multi-user 和 graphical
区分 rescue 和 emergency
```

### Day 2

```shell
systemctl get-default
systemctl set-default
```

练习：

```shell
查看默认启动 target
改成 multi-user.target
再改回 graphical.target 或当前默认值
重启验证
```

### Day 3

```shell
systemctl isolate
```

练习：

```shell
切到 multi-user.target
切到 rescue.target
观察当前会话和服务变化
```

### Day 4

```shell
rescue 模式
emergency 模式
```

练习：

```shell
进入 rescue 模式
查看挂载情况
查看哪些服务还在
进入 emergency 模式后观察差异
```

### Day 5

```shell
启动日志
journalctl -b
journalctl -b -1
cat /proc/cmdline
grubby --info=ALL
grubby --default-kernel
grub2-editenv list
```

练习：

```shell
看本次启动日志
看上次启动日志
查找启动失败服务
查看当前启动参数
查看默认内核
查看当前 grub 环境变量
理解正常启动和临时改内核参数的关系
```

### Day 6

练习：

```shell
在 GRUB 菜单中临时编辑内核参数进入救援或维护环境
拿到系统访问权限后完成基本排障
排障后恢复正常启动
```

整合练习：

- 改默认 target
- 重启验证
- 进入 rescue 模式
- 查一个启动失败服务日志
- 恢复回正常启动状态
- 在 GRUB 菜单中临时编辑内核参数进入救援 / 维护环境
- 完成排障后恢复正常启动

### Day 7

复盘：

- 整理 target 切换模板
- 整理 rescue / emergency 区别
- 整理 GRUB 中断启动模板
- 整理启动排障模板

## SELinux

> **目标**
> 把 SELinux 从“看不懂”变成“会查会修”

### 配套资料

官方主线

- 使用 SELinux（RHEL 10）
  [https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10/html-single/using_selinux/index](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10/html-single/using_selinux/index)
- How SELinux improves Red Hat Enterprise Linux security
  [https://developers.redhat.com/articles/2023/09/21/how-selinux-improves-red-hat-enterprise-linux-security](https://developers.redhat.com/articles/2023/09/21/how-selinux-improves-red-hat-enterprise-linux-security)
- Learn RHEL：Enhance RHEL with SELinux on the Developer Sandbox
  [https://developers.redhat.com/products/rhel/getting-started](https://developers.redhat.com/products/rhel/getting-started)

速查

- RHEL 10 Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet](https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet)
- Advanced Linux Commands Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/advanced-linux-commands](https://developers.redhat.com/cheat-sheets/advanced-linux-commands)

本机文档建议

```shell
man sestatus
man restorecon
man chcon
man semanage
man getsebool
man setsebool
man ausearch
```

### 必学命令

```shell
getenforce
setenforce
sestatus
ls -Z
ps -Z
restorecon
chcon
semanage
getsebool
setsebool
ausearch
```

### Day 1

```shell
SELinux 是什么
enforcing / permissive
```

练习：

```shell
getenforce
sestatus
```

### Day 2

```shell
安全上下文
ls -Z
ps -Z
```

练习：

```shell
看文件上下文
看进程上下文
```

### Day 3

```shell
restorecon
chcon
```

练习：

```shell
人为改坏上下文
用 restorecon 修复
```

### Day 4

```shell
semanage fcontext
```

练习：

```shell
semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
restorecon -Rv /web
```

### Day 5

```shell
getsebool
setsebool
semanage port -l
semanage port -a
semanage port -m
semanage port -d
```

练习：

```shell
getsebool -a | grep httpd
setsebool -P httpd_can_network_connect on
查看 http 相关端口标签
给一个新端口添加 http_port_t
验证服务是否能正常监听
删除测试端口标签
```

### Day 6

故障题训练：

- 服务目录权限看着对，但访问失败
- 换目录后服务起不来
- 端口不符合策略导致失败

### Day 7

复盘：

- 写一份“SELinux 排障 5 步法”
- 遇到异常先看什么，后看什么

## Podman 基础容器管理

> **目标**
> 把 Docker 经验迁移到 RHEL 容器工具链，练到会基础容器操作和简单持久化

### 配套资料

官方主线

- 构建、运行和管理容器（RHEL 10）
  [https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10/html-single/building_running_and_managing_containers/index](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10/html-single/building_running_and_managing_containers/index)
- Containers Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/containers](https://developers.redhat.com/cheat-sheets/containers)
- RHEL 10 Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet](https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet)

说明

- RHCSA 这里的重点是 **basic container management**
- 重点放在 **Podman 基础命令 + RHEL 生态习惯**
- 不要把精力放到 Compose 兼容层细节上

本机文档建议

```shell
man podman
man podman-run
man podman-exec
man podman-logs
man podman-inspect
```

### 必学命令

```shell
podman
podman pull
podman images
podman ps
podman run
podman exec
podman logs
podman stop
podman start
podman rm
podman rmi
podman inspect
```

### Day 1

```shell
podman 基础概念
images
containers
```

练习：

```shell
安装 podman
查看 podman version
查看 podman info
拉取一个基础镜像
```

### Day 2

```shell
podman pull
podman images
podman run
podman ps
```

练习：

```shell
拉取 ubi 或 nginx 镜像
运行一个容器
查看运行中的容器
停止并删除容器
```

### Day 3

```shell
端口映射
后台运行
```

练习：

```shell
运行一个 nginx 容器
映射到宿主机端口
用 curl 或浏览器访问
查看 logs
```

### Day 4

```shell
挂载目录
持久化数据
```

练习：

```shell
把宿主机目录挂到容器里
修改宿主机文件
看容器里是否同步变化
```

### Day 5

```shell
podman exec
podman inspect
podman logs
```

练习：

```shell
进入容器执行命令
查看容器配置
查看日志
排查容器起不来的原因
```

### Day 6

故障题训练：

- 拉镜像
- 起容器
- 配端口映射
- 配目录挂载
- 查看日志
- 停止、启动、删除容器

### Day 7

复盘：

- 整理 podman 基础命令模板
- 整理容器排障模板
- 对照 Docker 命令写一份迁移对照表

## 综合训练 + 模拟考试

> **目标**
> 把前面所有内容连起来做

### 配套资料

训练前必看

- EX200：考试目标
  [https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam](https://www.redhat.com/zh-cn/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam)
- RH199：快速提升课程
  [https://www.redhat.com/zh-cn/services/training/rh199-red-hat-certified-system-administrator-rapid-track-course](https://www.redhat.com/zh-cn/services/training/rh199-red-hat-certified-system-administrator-rapid-track-course)

模拟前最少过一遍

- RHEL 10 官方文档总目录
  [https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/10)
- RHEL 10 Cheat Sheet
  [https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet](https://developers.redhat.com/cheat-sheets/red-hat-enterprise-linux-10-cheat-sheet)
- Cheat Sheets 总入口
  [https://developers.redhat.com/cheat-sheets](https://developers.redhat.com/cheat-sheets)

资料使用规则

1. 优先自己做
2. 卡住先查 `man`
3. 再查 `info`
4. 再查 `/usr/share/doc`
5. 最后才回头翻网页笔记

### 这周规则

```shell
每次从干净快照恢复
限时 60 到 120 分钟
做完必须验证
最后必须重启验证
每套练习至少包含
用户 / 组
权限 / ACL
服务管理
日志查看
磁盘 / LVM
挂载 / fstab（UUID 或 LABEL）
firewalld
SELinux
计划任务
软件包管理 / 仓库 / 本地 RPM
硬链接 / 软链接
系统文档使用
shell 脚本
systemd timer
NFS 或 autofs
IPv6 或主机名解析
密码老化
SELinux 端口标签
target / rescue / GRUB 中断启动
基础 Podman 操作
```

### 每次练习后复盘

只记录：

- 哪一步不会
- 哪一步做慢了
- 哪一步忘记验证
- 哪一步本来可以直接查 `man / info / /usr/share/doc` 解决

## 每天固定模板

### 先看

一个小主题
不超过 30 分钟

### 再做

至少 1 小时
自己手打命令
不复制粘贴

### 再记

只记三类：

#### 命令模板

例如：

查找文件：

```shell
find /path -name "*.conf"
```

查找内容：

```shell
grep -r ssh /etc
```

#### 故障模板

例如：

服务起不来：

```shell
systemctl status
journalctl -u 服务名
ss -tlnp
firewall-cmd --list-all
getenforce
sestatus
```

#### 标准流程模板

例如：

LVM 新建：

```shell
pvcreate
vgcreate
lvcreate
mkfs.xfs
mount
fstab
```

## 优先级

### 第一优先级

SELinux

### 第二优先级

find / grep / 管道 / 文本处理 / 系统文档

### 第三优先级

LVM / 挂载 / fstab / NFS / autofs

### 第四优先级

用户权限 / ACL / 密码老化

### 第五优先级

进程 / 任务 / firewalld / systemd timer

### 第六优先级

软件包管理 / 仓库 / 本地 RPM / Podman 基础

## 使用建议

1. **每周至少做 1 次重启验证**
2. **每两周做 1 次综合训练**
3. **每次复盘都补 3 条“下次更快”的命令模板**
4. **不会的地方先查 `man / info / /usr/share/doc`，再查外部资料**
5. **所有配置类题目都要养成“做完立刻验证”的习惯**
