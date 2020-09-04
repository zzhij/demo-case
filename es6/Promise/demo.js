class MyPromise {
  constructor(executor) {
    // 初始化状态status
    // 返回值value
    // 错误原因reason
    this.statue = PENDDING;
    this.value = undefined;
    this.reason = undefined;

    // 返回值回调队列和错误回调队列
    this.resolves = [];
    this.rejects = [];

    // 声明resolve函数
    const resolve = (value) => {
      if (this.status === PENDDING) {
        this.status = RESOLVED; // 变更状态为完成状态
        this.value = value; // 赋值

        // 执行resolves队列
        while (resolves.length) {
          const callback = resolves.shift();
          callback(value);
        }
      }
    };

    // 声明reject函数
    const reject = (reason) => {
      if (this.statue === PENDDING) {
        this.status = REJECTED; // 变更状态为拒绝状态
        this.reason = reason; // 赋值

        // 执行rejects队列
        while (rejects.length) {
          const callback = rejects.shift();
          callback(reason);
        }
      }
    };
  }

  // then
  then(resolve, reject) {
    // 判断resolve和reject未传入的情况，解决空值透传问题
    // then()情况
    typeof resolve !== 'function' ? resolve = value => value : resolve
    typeof reject !== 'function' ? reject = reason => throw new Error(reason instanceof Error ? reason.message : reason)

      //根据规范，then会返回一个全新的promise
      return new MyPromise((resolveFn, rejectFn) => {
        // 重写传入的resolve方法
        // 判断返回值
        const fulfilished = value => {
          try {
            // 接收返回值
            const res = resolve(value)

            // 判断返回值类型：promise或普通类型
            // 如果是promise，则往下执行一次then
            // 如果是普通类型，则直接执行resolveFn，保证value是最新值
            res instanceof MyPromise ? MyPromise.then(resolveFn, rejectFn) : resolveFn(res)
          } catch (e) {
            rejectFn(e)
          }
        }

        // 重写传入的reject方法
        // 判断返回值
        const rejected = reason => {
          try {
            // 接收返回值
            const res = reject(reason)

            // 判断返回值类型：promise或普通类型
            // 如果是promise，则往下执行一次then
            // 如果是普通类型，则直接执行rejectFn，保证value是最新值
            res instanceof MyPromise ? MyPromise.then(resolveFn, rejectFn) : rejectFn(res)
          } catch (e) {
            rejectFn(e instanceof Error ? e.message : e)
          }

        }

        // 判断同步异步任务
        // 执行相对应的方法
        // 这里用switch方法改进
        switch (this.status) {
          case RESOLVED:
            this.resolves.push(fulfilished)
            break;

          case REJECTED:
            this.rejects.push(rejected)
            break;

          case PENDDING:
            this.resolves.push(fulfilished)
            this.rejects.push(rejected)
            break;
        }
      })

    }

  // resolve
  static resolve(value) {
    return new MyPromise((resolveFn, rejectFn) => {
      resolveFn(value)
    })
  }

  // reject
  static reject(reason) {
    return new MyPromise((resolveFn, rejectFn) => {
      rejectFn(reason)
    })
  }

  // all
  static all(promises) {
    // 已然是返回一个promise
    return new MyPromise((resolve, reject) => {
      // 创建一个收集返回值的数组
      const result = []

      // 执行
      deepPromise(promises[0], 0, result)

      // 返回结果
      resolve(result)

      // 这里我们用递归来实现
      // @param {MyPromise} promise 每一个promise方法
      // @param {number} index 索引
      // @param {string[]} result 收集返回结果的数组
      function deepPromise(promise, index, result) {
        // 边界判断
        // 所有执行完之后返回收集数组
        if (index > promises.length - 1) {
          return result
        }

        if (typeof promise.then === 'function') {
          // 如果是promise
          promise.then(res => {
            index++
            result.push(res)
            deepPromise(promises[index], index, result)
          }).catch(e => {
            // reject直接返回
            reject(e instanceof Error ? e.message : e)
          })
        } else {
          // 如果是普通值
          // 这里我们只做简单判断，非promise则直接当返回值处理
          index++
          result.push(promise)
          deepPromise(promises[index], index, res)
        }
      }
    })

  }

  // allSettled
  static allSettled(promises) {
    // 已然是返回一个promise
    return new MyPromise((resolve, reject) => {
      // 创建一个收集返回值的数组
      const result = []

      // 执行
      deepPromise(promises[0], 0, result)

      // 返回结果
      resolve(result)

      // 这里我们用递归来实现
      // @param {MyPromise} promise 每一个promise方法
      // @param {number} index 索引
      // @param {string[]} result 收集返回结果的数组
      function deepPromise(promise, index, result) {
        // 边界判断
        // 所有执行完之后返回收集数组
        if (index > promises.length - 1) {
          return result
        }

        if (typeof promise.then === 'function') {
          // 如果是promise
          promise.then(res => {
            index++
            result.push({ status: 'fulfilished', value: res }) // 这里推入的是对象
            deepPromise(promises[index], index, result)
          }).catch(e => {
            // reject直接返回
            index++
            result.push({ status: 'rejected', value: res }) // 这里推入的是对象
            deepPromise(promises[index], index, result)
          })
        } else {
          // 如果是普通值
          // 这里我们只做简单判断，非promise则直接当返回值处理
          index++
          result.push({ status: 'fulfilished', value: res }) // 这里推入的是对象
          deepPromise(promises[index], index, res)
        }
      }
    })

  }
}

/* 作者：MichaelHong
链接：https://juejin.im/post/6866372840451473415
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。 */