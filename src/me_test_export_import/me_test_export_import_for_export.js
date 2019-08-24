
export var a = '我是a'

// 测试结论 : const var let 并没有什么发挥他们定义变量的作用  并不是不能修改const 定义的变量的值
// export var b = '我是b'
// export const b = '我是b'
export let b = '我是b'

var c = '我是c'

// 测试结果:  一个模块中只能有一条默认导出语句存在 ,,,多 则报错,,,
export default '我是ccc啊'
// export default '我是ddd啊'

// 不能这样导出c  提示信息 : 'c' is already defined.
// export var c
export var d = c
