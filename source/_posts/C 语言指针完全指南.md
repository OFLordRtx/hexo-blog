---
abbrlink: ''
categories:
- - 编程语言
date: '2026-07-10T17:11:19.236462+08:00'
excerpt: C 语言指针完全指南  从内存模型到高级用法，覆盖 C 指针的所有核心知识点  一、内存与地址基础 1.1 内存模型 程序运行时，操作系统会给它分配一块****线性的内存空间，每个字节都有一个唯一的地址（通常是 16 进制数）  内存示意（64 位系统，地址 8 字节）：  ​  地址        内容  0x7FFD0000  [ ?? ]  0x7FFD0001  [ ?? ]  0x7FF...
tags:
- C
title: C 语言指针完全指南
updated: '2026-07-10T17:11:44.937+08:00'
---
# C 语言指针完全指南

> **从内存模型到高级用法，覆盖 C 指针的所有核心知识点**

## 一、内存与地址基础

### 1.1 内存模型

**程序运行时，操作系统会给它分配一块****线性的内存空间**，每个字节都有一个**唯一的地址**（通常是 16 进制数）

```
 内存示意（64 位系统，地址 8 字节）：
 
 地址        内容
 0x7FFD0000  [ ?? ]
 0x7FFD0001  [ ?? ]
 0x7FFD0002  [ 0x2A ]   ← 假设变量 a 在这里
 0x7FFD0003  [ 0x00 ]
 0x7FFD0004  [ 0x00 ]
 0x7FFD0005  [ 0x00 ]
 ...
```

**变量 **`int a = 42;` 实际上占用了 4 个字节（int 通常 4 字节），从某个地址开始连续存放

### 1.2 内存分区

**C 程序内存大致分为以下几个区域：**


| **区域**                    | **存放内容**                      | **生命周期**             |
| --------------------------- | --------------------------------- | ------------------------ |
| **代码区**（text）          | **程序指令**                      | **程序运行期间**         |
| **常量区**（rodata）        | **字符串字面量、**`const`全局变量 | **程序运行期间，只读**   |
| **全局/静态区**（data/bss） | **全局变量、**`static`变量        | **程序运行期间**         |
| **堆**（heap）              | `malloc`申请的内存                | **手动管理，**`free`释放 |
| **栈**（stack）             | **局部变量、函数参数**            | **函数返回时自动销毁**   |

```
 #include <stdio.h>
 #include <stdlib.h>
 
 int global = 1;             // 全局区 / global area
 const char *str = "hello";  // "hello" 在常量区 / "hello" in rodata
 static int s = 2;           // 静态区 / static area
 
 int main(void) {
     int local = 3;                       // 栈 / stack
     int *heap = malloc(sizeof(int));     // 堆 / heap
     *heap = 4;
     free(heap);
     return 0;
 }
```

---

## 二、指针的本质

### 2.1 什么是指针

**指针就是存储「地址」的变量**

```
 int a = 42;        // a 是普通变量，存储数值 42 / regular variable holding 42
 int *p = &a;       // p 是指针变量，存储 a 的地址 / pointer variable holding a's address
 内存视图：
 ┌────────────┬─────────────┐
 │ a          │ 42          │  ← 地址 0x1000
 ├────────────┼─────────────┤
 │ p          │ 0x1000      │  ← 地址 0x2000，p 里存的是 a 的地址
 └────────────┴─────────────┘
```

### 2.2 指针的大小

**所有指针的大小相同**，由系统位数决定：


| **系统**  | **指针大小** |
| --------- | ------------ |
| **32 位** | **4 字节**   |
| **64 位** | **8 字节**   |

```
 printf("%zu\n", sizeof(int *));     // 64 位输出 8 / outputs 8 on 64-bit
 printf("%zu\n", sizeof(char *));    // 8
 printf("%zu\n", sizeof(double *));  // 8
 printf("%zu\n", sizeof(void *));    // 8
```

### 2.3 类型的意义

**既然所有指针大小都一样，为什么还要区分 **`int *`、`char *`、`double *`？

**类型决定了两件事：**

1. **解引用时读取几个字节**
2. **指针算术 `+1` 移动几个字节**

```
 int    *pi;  // 解引用读 4 字节，+1 移动 4 字节 / dereferences 4 bytes, +1 moves 4 bytes
 char   *pc;  // 解引用读 1 字节，+1 移动 1 字节 / dereferences 1 byte, +1 moves 1 byte
 double *pd;  // 解引用读 8 字节，+1 移动 8 字节 / dereferences 8 bytes, +1 moves 8 bytes
```

---

## 三、指针的声明与初始化

### 3.1 声明语法

```
 类型 *指针名;
 int    *p1;   // 指向 int 的指针 / pointer to int
 char   *p2;   // 指向 char 的指针 / pointer to char
 double *p3;   // 指向 double 的指针 / pointer to double
```

**多个指针同行声明的坑：**

```
 int* a, b;    // ⚠️ a 是 int*，b 只是 int！/ a is int*, b is just int!
 int *a, *b;   // ✅ 两个都是 int* / both are int*
```

> **推荐风格：**`int *p` 而不是 `int* p`，让 `*` 紧贴变量名，避免歧义

### 3.2 初始化

**未初始化的指针是野指针，必须立即初始化**

```
 /* ❌ 危险：野指针，指向随机地址 / dangling: points to random address */
 int *p;
 *p = 10;   // 未定义行为 / undefined behavior
 
 /* ✅ 初始化为 NULL，明确表示"不指向任何地方" */
 int *p = NULL;
 
 /* ✅ 初始化为某个变量的地址 */
 int a = 42;
 int *p = &a;
 
 /* ✅ 初始化为动态申请的内存 */
 int *p = malloc(sizeof(int));
```

### 3.3 NULL 与 0

```
int *p = NULL;   // ✅ 标准写法 / standard
int *p = 0;      // ✅ 也合法，等价 / also valid, equivalent
int *p = (void*)0;  // NULL 的本质 / what NULL actually is
```

`NULL` 在 `<stddef.h>` 中定义，通常是 `((void*)0)`

---

## 四、取地址 `&` 与解引用 `*`

**这是一对****互逆操作**

### 4.1 取地址 `&`

`&变量` 返回变量的地址

```
int a = 42;
printf("%p\n", (void*)&a);   // 输出 a 的地址 / prints a's address
```

### 4.2 解引用 `*`

`*指针` 返回指针所指地址处的值

```
int a = 42;
int *p = &a;
printf("%d\n", *p);   // 输出 42 / prints 42
*p = 100;             // 修改 p 所指内容，即修改 a / modifies a through p
printf("%d\n", a);    // 输出 100 / prints 100
```

### 4.3 互逆关系

```
int a = 42;
int *p = &a;

*p == a;          // ✅ 解引用 p 等于 a 本身 / *p equals a
&(*p) == &a;      // ✅ 取 *p 的地址等于 &a / address of *p equals &a
*(&a) == a;       // ✅ 取 a 的地址再解引用等于 a / dereferencing &a gives a
```

**口诀：**`*` 和 `&` 互相抵消

---

## 五、NULL 指针与野指针

### 5.1 NULL 指针

**NULL 是一个明确表示"不指向任何地方"的特殊值**（通常是地址 0）

```
int *p = NULL;
if (p == NULL) {
    // 安全：可以判断 / safe: can be tested
}
*p = 10;  // ❌ 解引用 NULL 是未定义行为，通常导致段错误 / segfault
```

**为什么需要 NULL？**

* **表达"这个指针目前没有有效目标"**
* **函数返回 NULL 表示失败（如 **`malloc`、`fopen`）
* **防御性编程：**`free` 后置 NULL，避免悬空

### 5.2 野指针（Wild Pointer）

**指向未知/无效内存的指针**

**三种来源：**

```
/* 来源 1：未初始化 / uninitialized */
int *p;        // p 的值是随机的 / p contains garbage
*p = 10;       // ❌ 未定义行为 / undefined behavior

/* 来源 2：释放后未置空（悬空指针） / use-after-free (dangling) */
int *p = malloc(sizeof(int));
free(p);       // 内存已归还系统 / memory returned to OS
*p = 10;       // ❌ 仍在使用已释放的内存 / use-after-free

/* 来源 3：指向已销毁的局部变量 / pointing to destroyed stack variable */
int *bad(void) {
    int x = 10;
    return &x;  // ❌ 函数返回后 x 销毁 / x destroyed on return
}
```

### 5.3 防御性编程

```
/* 1. 声明时立即初始化 / initialize at declaration */
int *p = NULL;

/* 2. 使用前检查 NULL / check before use */
if (p != NULL) {
    *p = 10;
}

/* 3. free 后立即置 NULL / nullify after free */
free(p);
p = NULL;

/* 4. free(NULL) 是安全的，无需判断 / free(NULL) is safe */
free(p);   // 即使 p 是 NULL 也没问题 / OK even if p is NULL
```

---

## 六、指针算术

### 6.1 加减整数

`p + n` 表示移动 `n × sizeof(*p)` 字节，**不是 n 字节**

```
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;     // p 指向 arr[0] / p points to arr[0]

p + 1;            // 指向 arr[1]，地址 +4（int=4字节） / arr[1], address +4
p + 3;            // 指向 arr[3]，地址 +12 / arr[3], address +12
p - 1;            // 指向 arr[-1]（越界，未定义） / out of bounds
arr: [10][20][30][40][50]
      ↑   ↑   ↑   ↑   ↑
      p  p+1 p+2 p+3 p+4
```

### 6.2 自增自减

```
int *p = arr;
p++;       // p 移动到下一个元素 / p advances to next element
p--;       // p 移动到上一个元素 / p backs up
*p++;      // 先解引用，再 p++（运算符优先级） / dereference then increment
(*p)++;    // 解引用后的值 +1 / increment the pointed-to value
```

### 6.3 两指针相减

**指向同一数组的两个指针相减，结果是元素个数之差**（不是字节数）：

```
int arr[5] = {10, 20, 30, 40, 50};
int *p = &arr[1];
int *q = &arr[4];

ptrdiff_t diff = q - p;   // 结果为 3 / result is 3
```

**两指针相减返回 `ptrdiff_t` 类型**（在 `<stddef.h>` 中定义）

```
/* 不在同一数组内的指针相减是未定义行为 / UB if not in same array */
int a, b;
&b - &a;   // ❌ 未定义 / undefined
```

### 6.4 不能做的运算

```
p + q;     // ❌ 两个指针不能相加 / pointers can't be added
p * 2;     // ❌ 指针不能乘除 / no multiplication/division
p + 1.5;   // ❌ 只能加减整数 / only integer arithmetic
```

### 6.5 指针比较

**同一数组内的指针可以比较大小：**

```
int arr[5];
int *p = &arr[1];
int *q = &arr[3];

p < q;     // ✅ true
p == q;    // ✅ 检查是否指向同一位置 / same location?
p != NULL; // ✅ NULL 比较任何时候都合法 / NULL comparison always OK
```

---

## 七、指针与数组

**这是 C 语言最容易混淆的部分**

### 7.1 数组名的本质

**数组名在大多数场合会"退化"为指向首元素的指针**

```
int arr[5] = {1, 2, 3, 4, 5};

int *p = arr;       // arr 退化为 &arr[0] / arr decays to &arr[0]
int *p = &arr[0];   // 等价 / equivalent
```

### 7.2 退化的场景


| **表达式**     | **是否退化**  | **类型**    |
| -------------- | ------------- | ----------- |
| `arr`单独使用  | **✅ 退化**   | `int *`     |
| `arr + 1`算术  | **✅ 退化**   | `int *`     |
| **传给函数**   | **✅ 退化**   | `int *`     |
| **赋值给指针** | **✅ 退化**   | `int *`     |
| `sizeof(arr)`  | **❌ 不退化** | `int[5]`    |
| `&arr`         | **❌ 不退化** | `int(*)[5]` |

### 7.3 sizeof 的关键区别

```
int arr[5] = {1, 2, 3, 4, 5};
int *p = arr;

sizeof(arr);   // 20（5 × 4 字节，整个数组） / 20 bytes (whole array)
sizeof(p);     // 8（64位指针大小） / 8 bytes (pointer size)
sizeof(*p);    // 4（int 大小） / 4 bytes (size of int)
sizeof(arr[0]);// 4（单个元素） / 4 bytes (one element)

/* 计算数组元素个数的经典写法（必须对原始数组，不能对指针） */
size_t n = sizeof(arr) / sizeof(arr[0]);  // 5
```

### 7.4 四种等价的访问方式

```
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;

/* 以下都访问 arr[2] = 30 / all access arr[2] = 30 */
arr[2];
*(arr + 2);
p[2];
*(p + 2);
```

**下标 **`[]` 是 `*( + )` 的语法糖：

```
a[i]  ⟺  *(a + i)  ⟺  *(i + a)  ⟺  i[a]   // 最后一种合法但反人类 / legal but weird
```

### 7.5 `arr` 与 `&arr` 的区别

```
int arr[5];

arr;     // 类型 int *，值为 &arr[0]
&arr;    // 类型 int(*)[5]，值为整个数组的地址（数值上和 &arr[0] 相同）
```

**虽然数值相同，但****类型不同导致算术行为不同**：

```
arr + 1;    // 移动 4 字节（一个 int）/ moves 4 bytes
&arr + 1;   // 移动 20 字节（整个数组）/ moves 20 bytes (entire array)
```

---

## 八、指针与字符串

### 8.1 两种字符串声明

```
char *s1  = "hello";   // 指向字符串常量区 / points to rodata
char  s2[] = "hello";  // 栈上分配并拷贝 / allocated on stack
```

**内存视图：**

```
常量区：[ 'h' 'e' 'l' 'l' 'o' '\0' ]  ← 只读 / read-only
                ↑
                s1（指针，指向常量区）

栈：    [ 'h' 'e' 'l' 'l' 'o' '\0' ]  ← s2（数组，可修改）
```

### 8.2 关键区别

```
char *s1 = "hello";
char  s2[] = "hello";

/* 修改测试 / modification test */
s1[0] = 'H';    // ❌ 修改只读内存，段错误 / segfault
s2[0] = 'H';    // ✅ 合法，s2 是栈上副本 / OK, s2 is on stack

/* sizeof */
sizeof(s1);     // 8（指针）/ 8 (pointer)
sizeof(s2);     // 6（5 字符 + '\0'）/ 6 (5 chars + null terminator)

/* 重新赋值 / reassignment */
s1 = "world";   // ✅ 指针可以改指向 / pointer can be redirected
s2 = "world";   // ❌ 数组名不能赋值 / array name not assignable
```

### 8.3 推荐写法

```
/* 只读字符串：用 const char * / read-only: use const char* */
const char *s = "hello";   // 明确告诉编译器不要修改 / explicitly read-only

/* 需要修改：用数组 / need modification: use array */
char buf[64] = "hello";
buf[0] = 'H';
```

### 8.4 字符串操作必须注意空间

```
char *src = "hello, world";
char dst[5];                    // ❌ 容量不够 / not enough room
strcpy(dst, src);               // ❌ 缓冲区溢出 / buffer overflow

char dst[64];                   // ✅ 预留足够空间 / enough room
strcpy(dst, src);

/* 更安全的写法 / safer version */
strncpy(dst, src, sizeof(dst) - 1);
dst[sizeof(dst) - 1] = '\0';    // 手动保证终止符 / ensure null terminator
```

---

## 九、函数传参

### 9.1 C 语言永远是值传递

**无论传什么类型，****实际传递的都是值的副本**，指针也不例外——复制的是指针存的地址值

### 9.2 值传递 vs 指针传递

```
/* 值传递：无法修改外部变量 / pass by value: can't modify external */
void bad(int x) {
    x = 100;   // 只改了形参副本 / only modifies local copy
}

/* 指针传递：可修改外部变量的内容 / pass by pointer: can modify */
void good(int *p) {
    *p = 100;  // 解引用修改 p 指向的内存 / dereference to modify
}

int main(void) {
    int a = 1;
    bad(a);          printf("%d\n", a);   // 1（未改变） / 1 (unchanged)
    good(&a);        printf("%d\n", a);   // 100（被修改） / 100 (modified)
    return 0;
}
```

### 9.3 关键陷阱：只改指针副本无效

```
void trap(int *p) {
    p = NULL;   // ❌ 只改了形参 p，外部不受影响 / only local change
}

int a = 42;
int *ptr = &a;
trap(ptr);
printf("%p\n", (void*)ptr);   // ptr 仍指向 a / ptr still points to a
```

**判断技巧：函数内有没有通过 `\*` 解引用？**

* **有 → 能修改外部数据**
* **没有（只改形参本身）→ 不能修改外部**

### 9.4 要修改外部指针，需传二级指针

```
void set_null(int **pp) {
    *pp = NULL;   // 解引用一次，修改外部指针 / one deref modifies outer pointer
}

int a = 42;
int *ptr = &a;
set_null(&ptr);
printf("%p\n", (void*)ptr);   // NULL
```

### 9.5 数组传参一定退化

```
void f(int arr[10]) {     // ⚠️ 等价于 int *arr / equivalent to int *arr
    sizeof(arr);          // 8，不是 40 / 8, not 40
}

void g(int *arr, int len) {   // ✅ 推荐：显式传长度 / preferred: pass length
    for (int i = 0; i < len; i++)
        printf("%d ", arr[i]);
}

int arr[10];
g(arr, sizeof(arr) / sizeof(arr[0]));   // ✅ 调用方计算长度 / caller computes size
```

### 9.6 const 保护只读参数

```
/* 函数声明 const，告诉调用方：我不会改你的数据 */
/* Declares const to signal: I won't modify your data */
void print_array(const int *arr, int len) {
    for (int i = 0; i < len; i++)
        printf("%d ", arr[i]);
    /* arr[0] = 99; ❌ 编译器拦住 / compiler blocks this */
}
```

---

## 十、二级指针与多级指针

### 10.1 概念

**指向指针的指针**

```
int   a  = 7;
int  *p  = &a;    // p 存 a 的地址 / p holds a's address
int **pp = &p;    // pp 存 p 的地址 / pp holds p's address
内存示意：
[0x1000] pp = 0x2000
[0x2000] p  = 0x3000
[0x3000] a  = 7
```

### 10.2 逐层解引用

**每个 **`*` 穿透一层，**只影响那一层**：

```
pp           // pp 本身（一个地址）/ pp itself
*pp          // p 本身（也是一个地址，等于 &a）/ p itself
**pp         // a 的值（7）/ a's value

/* 修改时同理 */
pp = NULL;   // 改 pp 本身 / modify pp
*pp = &b;    // 改 p（让 p 指向 b） / modify p
**pp = 99;   // 改 a 的值 / modify a's value
```

### 10.3 典型用途 1：函数内修改外部指针

```
/* 让 caller 的指针指向新分配的内存 / let caller's pointer point to new memory */
void create_array(int **out, int len) {
    *out = malloc(sizeof(int) * len);
    for (int i = 0; i < len; i++)
        (*out)[i] = i * 10;
}

int main(void) {
    int *arr = NULL;
    create_array(&arr, 5);
    /* arr 现在指向分配的数组 / arr now points to allocated array */
    for (int i = 0; i < 5; i++)
        printf("%d ", arr[i]);
    free(arr);
    return 0;
}
```

### 10.4 典型用途 2：argv

```
int main(int argc, char **argv) {
    /* argv 是 char**：指向 char* 数组的指针 */
    /* argv is char**: pointer to array of char* */
    for (int i = 0; i < argc; i++)
        printf("argv[%d] = %s\n", i, argv[i]);
    return 0;
}
argv ──► [argv[0]] ──► "program_name"
         [argv[1]] ──► "arg1"
         [argv[2]] ──► "arg2"
         [NULL]
```

### 10.5 三级及以上

```
int   a   = 1;
int  *p   = &a;
int **pp  = &p;
int ***ppp = &pp;

***ppp = 99;   // 三次解引用，修改 a / three derefs modify a
```

**实际开发中很少超过二级，三级以上通常说明设计有问题**

---

## 十一、const 指针

### 11.1 三种形式

**口诀：****`\*` 左边的 const 限制内容，`\*` 右边的 const 限制指针**

```
int a = 1, b = 2;

/* 形式 1：内容不可改，指针可改 */
/* Form 1: content read-only, pointer mutable */
const int *p1 = &a;
*p1 = 10;   // ❌
p1  = &b;   // ✅

/* 形式 2：内容可改，指针不可改 */
/* Form 2: content mutable, pointer read-only */
int * const p2 = &a;
*p2 = 10;   // ✅
p2  = &b;   // ❌

/* 形式 3：都不可改 / both read-only */
const int * const p3 = &a;
*p3 = 10;   // ❌
p3  = &b;   // ❌
```

### 11.2 `const int *` 与 `int const *` 等价

```
const int *p;    // 等价 / equivalent
int const *p;    // 等价 / equivalent
```

**读取规则：从右往左读，最近的修饰最先生效**

### 11.3 实战用途

**1. 保护只读输入参数：**

```
size_t my_strlen(const char *s) {
    size_t n = 0;
    while (*s++) n++;
    return n;
}
```

**2. 防止误修改全局指针：**

```
extern int * const GLOBAL_PTR;   // 指针不可改，但内容可改
                                 // pointer fixed, content mutable
```

**3. 字符串字面量：**

```
const char *msg = "hello";   // 字符串字面量本就在只读区 / literals are read-only
                             // 用 const 让编译器帮你拦截误改 / let compiler enforce
```

### 11.4 const 兼容性规则

```
int a = 1;
int *p = &a;
const int *cp = p;   // ✅ 普通指针可以赋给 const 指针 / non-const → const OK

const int b = 2;
const int *cp2 = &b;
int *p2 = cp2;       // ⚠️ 警告：丢弃 const 限定 / warning: discards const
```

---

## 十二、void 指针

### 12.1 通用指针

`void *` 是 "类型未定" 的指针：**能存任何地址，但不能直接解引用**

```
int    a = 42;
float  f = 3.14;
char   c = 'A';

void *p;
p = &a;   // ✅
p = &f;   // ✅
p = &c;   // ✅ 任何类型都能存 / any type accepted
```

### 12.2 不能直接解引用

```
void *p = &a;

*p;          // ❌ 编译错误：不知道读几个字节 / compile error: unknown size
sizeof(*p);  // ❌ 编译错误 / compile error
p + 1;       // ❌ 不能做指针算术 / no pointer arithmetic on void*
```

### 12.3 使用方式：强制转换

```
int   a = 42;
void *p = &a;

int x = *(int *)p;             // ✅ 转换为 int* 再解引用 / cast then deref
printf("%d\n", *(int *)p);     // 输出 42 / prints 42

/* 不同类型的处理 / handling different types */
float f = 3.14;
p = &f;
printf("%f\n", *(float *)p);   // 输出 3.14 / prints 3.14
```

### 12.4 典型用途

**1. `malloc` 返回 `void \*`：**

```
int *p = malloc(sizeof(int) * 10);
/* malloc 原型：void *malloc(size_t); */
/* C 中 void* 可隐式转换为任意类型，无需强转 */
/* In C, void* implicitly converts; no cast needed (C++ requires cast) */
```

**2. 通用函数（如 `qsort`、`memcpy`）：**

```
void *memcpy(void *dest, const void *src, size_t n);

int  arr1[5] = {1, 2, 3, 4, 5};
int  arr2[5];
memcpy(arr2, arr1, sizeof(arr1));   // 不关心类型，按字节复制 / type-agnostic byte copy
```

**3. 实现泛型容器：**

```
typedef struct {
    void *data;     // 任意类型的元素 / generic element type
    size_t size;    // 单个元素字节数 / size per element
    size_t count;
} GenericArray;
```

---

## 十三、函数指针

### 13.1 函数也有地址

**每个函数在内存中都有一个起始地址，****函数名就是函数的地址**（类似数组名）

```
int add(int a, int b) { return a + b; }

printf("%p\n", (void*)add);    // 函数 add 的地址 / address of add
printf("%p\n", (void*)&add);   // 同上 / same as above
```

### 13.2 函数指针声明

```
返回类型 (*指针名)(参数类型列表);
/* 指向 int(int, int) 的函数指针 / pointer to int(int, int) */
int (*fp)(int, int);

/* ⚠️ 括号不能省 / parentheses are mandatory */
int *fp(int, int);    // ❌ 这是函数声明，返回 int* / function returning int*
int (*fp)(int, int);  // ✅ 这才是函数指针 / actual function pointer
```

### 13.3 赋值与调用

```
int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int (*fp)(int, int);

fp = add;          // ✅ 函数名自动取地址 / function name decays
fp = &add;         // ✅ 显式取地址，等价 / explicit, equivalent

int r1 = fp(2, 3);     // 5（调用 add） / calls add
int r2 = (*fp)(2, 3);  // 5（显式解引用，等价） / explicit deref, equivalent

fp = mul;
int r3 = fp(2, 3);     // 6（改指向 mul） / now calls mul
```

### 13.4 typedef 简化

```
/* 不用 typedef：每次声明都要写完整类型 / without typedef: verbose */
int (*fp1)(int, int);
int (*fp2)(int, int);

/* 用 typedef：定义一个类型别名 / with typedef: cleaner */
typedef int (*BinaryOp)(int, int);
BinaryOp fp1 = add;
BinaryOp fp2 = mul;
```

### 13.5 函数指针数组

```
typedef int (*BinaryOp)(int, int);

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int divi(int a, int b) { return a / b; }

BinaryOp ops[] = {add, sub, mul, divi};

for (int i = 0; i < 4; i++)
    printf("%d\n", ops[i](10, 3));   // 13, 7, 30, 3
```

### 13.6 回调函数

**函数指针最经典的用途：****让 caller 把自定义逻辑传给被调用方**

```
/* qsort 标准库示例 / qsort standard library example */
int compare_int(const void *a, const void *b) {
    return *(int*)a - *(int*)b;
}

int arr[] = {3, 1, 4, 1, 5, 9, 2, 6};
qsort(arr, 8, sizeof(int), compare_int);
/* qsort 调用 compare_int 来比较元素 */
/* qsort calls compare_int to compare elements */
```

---

## 十四、指针与结构体

### 14.1 通过指针访问成员

```
struct Point {
    int x;
    int y;
};

struct Point pt = {1, 2};
struct Point *p = &pt;

/* 两种访问方式，完全等价 / two equivalent ways */
(*p).x;    // 原始写法：先解引用，再取成员 / dereference then access
p->x;      // 语法糖：箭头运算符 / syntactic sugar (arrow operator)
```

`->` 是 `(*).` 的语法糖，由于结构体指针使用频繁，C 提供了这个简写

### 14.2 修改成员

```
struct Point pt = {1, 2};
struct Point *p = &pt;

p->x = 10;    // 等价于 (*p).x = 10
p->y = 20;
/* pt 现在是 {10, 20} / pt is now {10, 20} */
```

### 14.3 结构体作为函数参数

```
/* 传值：复制整个结构体，开销大 / pass by value: copies whole struct */
void by_value(struct Point pt) {
    pt.x = 999;   // 修改副本，不影响原结构体 / modifies local copy
}

/* 传指针：只传 8 字节地址，高效，且可修改原数据 */
/* Pass pointer: just 8 bytes, efficient, can modify original */
void by_pointer(struct Point *pt) {
    pt->x = 999;
}

/* 只读传指针：const 保护 / read-only pointer pass */
void by_const_pointer(const struct Point *pt) {
    printf("%d %d\n", pt->x, pt->y);
    /* pt->x = 0; ❌ 编译器拦住 / compiler blocks */
}
```

### 14.4 结构体指针的典型场景：链表

```
typedef struct Node {
    int value;
    struct Node *next;   // 指向下一个节点 / points to next node
} Node;

/* 构建链表：1 -> 2 -> 3 -> NULL */
Node n3 = {3, NULL};
Node n2 = {2, &n3};
Node n1 = {1, &n2};

/* 遍历 / traverse */
for (Node *p = &n1; p != NULL; p = p->next)
    printf("%d ", p->value);   // 1 2 3
```

---

## 十五、动态内存管理

### 15.1 四个核心函数

```
#include <stdlib.h>

void *malloc(size_t size);                // 分配内存 / allocate
void *calloc(size_t n, size_t size);      // 分配并清零 / allocate and zero
void *realloc(void *p, size_t new_size);  // 重新分配 / reallocate
void  free(void *p);                      // 释放 / free
```

### 15.2 malloc

```
/* 分配能存 10 个 int 的内存 / allocate room for 10 ints */
int *p = malloc(sizeof(int) * 10);

/* 必须检查返回值 / always check return value */
if (p == NULL) {
    perror("malloc failed");
    exit(1);
}

/* 内存内容未初始化（随机值）/ memory is uninitialized */
p[0] = 1;   // 必须先赋值再读 / must write before read
```

### 15.3 calloc

```
/* 分配 10 个 int，并全部清零 / allocate 10 ints, all zeroed */
int *p = calloc(10, sizeof(int));

/* 等价于 / equivalent to */
int *p = malloc(sizeof(int) * 10);
memset(p, 0, sizeof(int) * 10);
```

### 15.4 realloc

```
/* 扩容或缩容 / resize allocation */
int *p = malloc(sizeof(int) * 10);
int *new_p = realloc(p, sizeof(int) * 20);

if (new_p == NULL) {
    /* 失败时原 p 仍然有效 / on failure, original p still valid */
    free(p);
    exit(1);
}
p = new_p;   // 成功，更新指针 / success: update pointer
```

**注意：** `realloc` 可能返回新地址，旧指针失效

### 15.5 free

```
free(p);   // 归还内存给系统 / return memory to OS
p = NULL;  // ✅ 防御性置 NULL / defensive nullification

/* free(NULL) 是安全的 / free(NULL) is safe */
int *p = NULL;
free(p);   // 不做任何事 / no-op
```

### 15.6 三大经典错误

#### ① 内存泄漏（Memory Leak）

```
void leak(void) {
    int *p = malloc(sizeof(int) * 100);
    if (p[0] > 0) return;   // ❌ 忘了 free
    free(p);
}
/* 每次调用泄漏 400 字节，长期运行内存耗尽 */
/* Each call leaks 400 bytes; eventually exhausts memory */
```

**修法：** 每条返回路径都要释放

```
void fixed(void) {
    int *p = malloc(sizeof(int) * 100);
    if (!p) return;

    int condition = (p[0] > 0);
    free(p);
    p = NULL;

    if (condition) return;
    /* 后续逻辑 / further logic */
}
```

#### ② Double Free（重复释放）

```
int *p = malloc(sizeof(int));
free(p);
free(p);   // ❌ 未定义行为，可能崩溃或安全漏洞 / UB, possible crash or exploit
```

**修法：** free 后立即置 NULL

```
free(p);
p = NULL;
free(p);   // ✅ free(NULL) 安全 / safe
```

#### ③ Use After Free（悬空指针使用）

```
int *p = malloc(sizeof(int));
*p = 42;
free(p);
printf("%d\n", *p);   // ❌ 使用已释放内存 / use-after-free
```

**修法：** free 后置 NULL，并在使用前检查

```
free(p);
p = NULL;
if (p != NULL) printf("%d\n", *p);   // 不会执行 / won't execute
```

### 15.7 黄金规则

```
/* 1. malloc 后检查 NULL / check after malloc */
int *p = malloc(size);
if (!p) { /* 错误处理 */ }

/* 2. 每个 malloc 配对一个 free / pair every malloc with free */

/* 3. free 后立即置 NULL / nullify after free */
free(p);
p = NULL;

/* 4. 不要释放栈变量地址 / never free stack addresses */
int a;
free(&a);   // ❌ 严重错误 / serious error
```

---

## 十六、数组指针与指针数组

**声明类似，但含义完全不同**

### 16.1 指针数组（Array of Pointers）

**一个数组，元素是指针**

```
int *arr[5];   // 数组：5 个 int* 元素 / array of 5 int*
arr: [ptr][ptr][ptr][ptr][ptr]
```

**典型用途：字符串数组**

```
const char *names[] = {
    "Alice",
    "Bob",
    "Charlie"
};

for (int i = 0; i < 3; i++)
    printf("%s\n", names[i]);
```

### 16.2 数组指针（Pointer to Array）

**一个指针，指向整个数组**

```
int (*p)[5];   // 指针：指向「5 个 int 的数组」/ pointer to array of 5 ints
p ──► [int][int][int][int][int]
       └────── 整个数组 ──────┘
```

**用法：**

```
int arr[5] = {1, 2, 3, 4, 5};
int (*p)[5] = &arr;   // 必须用 &arr / must use &arr

(*p)[0];   // 访问 arr[0] / access arr[0]
(*p)[2];   // 访问 arr[2] / access arr[2]
```

### 16.3 优先级口诀

```
int *arr[5];    // [] 优先级高于 *：先是数组，再是指针 / array first, then pointer
int (*p)[5];    // 括号改变结合：先是指针，再是数组 / parens change: pointer first
```

### 16.4 二维数组与数组指针

```
int matrix[3][4];   // 3 行 4 列 / 3 rows, 4 cols

/* matrix 退化时的类型 / decay type */
int (*p)[4] = matrix;   // 退化为「指向 4 元素数组的指针」/ pointer to 4-int array

p[1][2];        // 访问 matrix[1][2] / access matrix[1][2]
*(*(p+1) + 2);  // 等价 / equivalent
```

### 16.5 函数参数中的二维数组

```
/* 传二维数组：必须指定除第一维外的所有维度 */
/* Passing 2D array: must specify all dimensions except first */
void f1(int arr[3][4]);
void f2(int arr[][4]);    // 等价 / equivalent
void f3(int (*arr)[4]);   // 等价（数组指针）/ equivalent (array pointer)

/* ❌ 错误：信息不全 / wrong: insufficient info */
void bad(int arr[][]);
void bad2(int **arr);   // 这是指针的指针，不是二维数组 / pointer-to-pointer, not 2D array
```

---

## 十七、常见陷阱与防御编程

### 17.1 野指针

```
/* ❌ 未初始化 / uninitialized */
int *p;
*p = 10;

/* ✅ 立即初始化 / initialize immediately */
int *p = NULL;
```

### 17.2 悬空指针

```
/* ❌ 返回局部变量地址 / returning stack address */
int *bad(void) {
    int x = 10;
    return &x;   // x 在函数返回时销毁 / x destroyed on return
}

/* ✅ 使用堆内存或传入指针 / use heap or pass pointer */
int *good(void) {
    int *p = malloc(sizeof(int));
    *p = 10;
    return p;   // 调用方负责 free / caller must free
}
```

### 17.3 缓冲区溢出

```
char buf[10];
strcpy(buf, "hello, world!");   // ❌ 13 字节写入 10 字节空间 / 13 bytes in 10-byte buffer

/* ✅ 使用带长度限制的版本 / use bounded versions */
char buf[10];
strncpy(buf, "hello, world!", sizeof(buf) - 1);
buf[sizeof(buf) - 1] = '\0';

/* 更推荐：snprintf / preferred: snprintf */
snprintf(buf, sizeof(buf), "%s", "hello, world!");
```

### 17.4 数组越界

```
int arr[5];
arr[5] = 10;    // ❌ 越界，未定义行为 / out of bounds, UB
arr[-1] = 10;   // ❌ 越界 / out of bounds

/* ✅ 边界检查 / bounds check */
int i = ...;
if (i >= 0 && i < 5) arr[i] = 10;
```

### 17.5 整数溢出导致分配错误

```
size_t n = ...;
int *p = malloc(n * sizeof(int));   // ⚠️ n 太大时溢出 / may overflow

/* ✅ 检查溢出 / check overflow */
if (n > SIZE_MAX / sizeof(int)) {
    /* 太大 / too large */
    return -1;
}
int *p = malloc(n * sizeof(int));
```

### 17.6 完整的防御性代码模板

```
int safe_function(int len) {
    /* 1. 参数检查 / validate inputs */
    if (len <= 0 || len > MAX_LEN) return -1;

    /* 2. 分配并检查 / allocate and check */
    int *p = malloc(sizeof(int) * len);
    if (p == NULL) return -1;

    /* 3. 使用 / use */
    for (int i = 0; i < len; i++)
        p[i] = i;

    /* 4. 释放并置 NULL / free and nullify */
    free(p);
    p = NULL;

    return 0;
}
```

---

## 十八、复杂指针声明的解读

### 18.1 顺时针螺旋法则

**从变量名开始，按****右→上→左→下**螺旋方向阅读

### 18.2 经典例子

```
int *p;             // p 是指向 int 的指针 / pointer to int
int **p;            // p 是指向「int 指针」的指针 / pointer to pointer to int
int *p[10];         // p 是「10 个 int* 的数组」/ array of 10 pointers to int
int (*p)[10];       // p 是「指向 10 个 int 数组」的指针 / pointer to array of 10 ints
int (*p)(int);      // p 是「参数为 int、返回 int 的函数指针」/ pointer to function
int *(*p)(int);     // p 是「参数为 int、返回 int* 的函数指针」/ ptr to func returning int*
int (*p[10])(int);  // p 是「10 个函数指针的数组」/ array of 10 function pointers
```

### 18.3 用 cdecl 工具辅助

```
$ echo 'explain int (*p[10])(int)' | cdecl
declare p as array 10 of pointer to function (int) returning int
```

**或使用在线工具：**[https://cdecl.org/](https://cdecl.org/)

### 18.4 用 typedef 拆解

**复杂声明用 **`typedef` 一层层拆解：

```
/* 直接写：难以阅读 / hard to read */
int (*fp[10])(int, int);

/* 拆解：清晰 / step-by-step: clear */
typedef int (*BinaryOp)(int, int);   // 函数指针类型 / function pointer type
BinaryOp fp[10];                      // 10 个函数指针的数组 / array of 10
```

---

## 附录 A：术语对照表


| **中文**       | **英文**                    |
| -------------- | --------------------------- |
| **指针**       | **pointer**                 |
| **解引用**     | **dereference**             |
| **取地址**     | **address-of**              |
| **退化**       | **decay**                   |
| **野指针**     | **wild pointer**            |
| **悬空指针**   | **dangling pointer**        |
| **空指针**     | **null pointer**            |
| **内存泄漏**   | **memory leak**             |
| **缓冲区溢出** | **buffer overflow**         |
| **未定义行为** | **undefined behavior (UB)** |
| **二级指针**   | **pointer to pointer**      |
| **函数指针**   | **function pointer**        |
| **回调**       | **callback**                |

## 附录 B：检查清单

**写指针代码时，依次自检：**

* [ ]  所有指针都已初始化（NULL 或有效地址）？
* [ ]  每次解引用前是否检查 NULL？
* [ ]  每个 `malloc/calloc/realloc` 是否检查返回值？
* [ ]  每个 `malloc` 是否对应一个 `free`？
* [ ]  `free` 后是否立即置 NULL？
* [ ]  函数返回的指针是否合法（非局部变量）？
* [ ]  数组访问是否有边界检查？
* [ ]  字符串操作是否使用带长度限制的版本？
* [ ]  是否存在 use-after-free 风险？
* [ ]  是否存在 double-free 风险？

---

**本文档完整覆盖 C 语言指针的核心概念，掌握后可以无缝过渡到 Rust 的所有权和借用系统**
