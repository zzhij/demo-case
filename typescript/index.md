# typescript

## type
* 字面意思，用来给一个类型起个新名字。常用于联合类型，使用如下。
```ts
  type str1 = string;
  type str2 = ()=>string;   //此为函数类型形状，注意跟下面区分
  type str = str1 | str2;

  let s:str = "hello";
  let s1:str = () =>"heihei";   //此为箭头函数

```
* 字符串字面量
```ts
  type Name = "xiaoming"|"xiaohong"|"xiaozhang";

  let theName:Name = "xiaozhang";   //正常
  let theName1:Name = "xiaoxue";   //报错！！！，只能为Name中字符串其一。

```