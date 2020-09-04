// 获取元素到文档顶部距离
const offsetTop = function (element) {
  const offsetParent = element.offsetParent
  return element.offsetTop + (offsetParent ? offsetTop(offsetParent) : 0)
}
// 获取元素到左边的距离
const offsetLeft = function (element) {
  const offsetParent = element.offsetParent
  return element.offsetLeft + (offsetParent ? offsetLeft(offsetParent) : 0)
}