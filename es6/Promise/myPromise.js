class MyPromise {
  constructor(executor) {
    // 控制状态
    this.status = 'pendding'
    this.value = undefined
    this.reason = undefined
  }
  
  // resolve函数
  let resolve = (data) => {
    if (this.status == 'pendding') {

    }
  }

  // 定义
  let reject = (reason) => {
    
  }
}