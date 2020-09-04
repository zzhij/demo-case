export default {
  mounted() {
    this.$nextTick(() => {
      /* eslint-disable no-mixed-operators */
      const that = this
      // 获取mouse相对文档的位置 （包括有滚动条）
      function getMousePosition(event) {
        let x = 0
        let y = 0
        const doc = document.documentElement
        const body = document.body
        if (!event) event = window.event
        if (window.pageYoffset) { // pageYoffset是Netscape特有
          x = window.pageXOffset
          y = window.pageYOffset
        } else {
          x = ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0)
          y = (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0)
        }
        x += event.clientX
        y += event.clientY
        return {
          x: x,
          y: y
        }
      }

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
      this.$refs.dragBox.addEventListener('mousedown', function() {
        // return false
        var selList = []
        var fileNodes = document.getElementById('item-box').getElementsByClassName('item-drag')
        for (var i = 0; i < fileNodes.length; i++) {
          if (fileNodes[i].className.indexOf('item-drag') != -1) {
            fileNodes[i].className = 'item item-drag'
            selList.push(fileNodes[i])
          }
        }

        var isSelect = true
        var evt = window.event || arguments[0]
        const position = getMousePosition(evt)
        var startX = (position.x || evt.pageX)
        var startY = (position.y || evt.pageY)
        var selDiv = document.createElement('div')
        selDiv.style.cssText = 'position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;'
        selDiv.id = 'selectDiv'
        if (document.getElementById('selectDiv')) {
          document.body.removeChild(document.getElementById('selectDiv'))
        }
        document.body.appendChild(selDiv)

        selDiv.style.left = startX + 'px'
        selDiv.style.top = startY + 'px'

        var _x = null
        var _y = null
        clearEventBubble(evt)
        that.$refs.dragBox.onmousemove = function() {
          evt = window.event || arguments[0]
          if (isSelect) {
            if (selDiv.style.display == 'none') {
              selDiv.style.display = ''
            }
            var positionM = getMousePosition(evt)
            _x = (positionM.x || evt.x || evt.clientX)
            _y = (positionM.y || evt.y || evt.clientY)
            selDiv.style.left = Math.min(_x, startX) + 'px'
            selDiv.style.top = Math.min(_y, startY) - (_y > startY ? 2 : -2) + 'px'
            selDiv.style.width = Math.abs(_x - startX) + 'px'
            selDiv.style.height = Math.abs(_y - startY) + 'px'

            // ---------------- 关键算法 ---------------------
            var _l = selDiv.offsetLeft // selDIV 到文档左边距离
            var _t = selDiv.offsetTop // selDIV 到文档顶部距离
            var _w = selDiv.offsetWidth // selDIV 的宽度 border
            var _h = selDiv.offsetHeight // selDIV 的高度 border

            for (var i = 0; i < selList.length; i++) {
              var sl = selList[i].offsetWidth + offsetLeft(selList[i])
              var st = selList[i].offsetHeight + offsetTop(selList[i])
              if (sl > _l && st > _t && offsetLeft(selList[i]) < _l + _w && offsetTop(selList[i]) < _t + _h) {
                if (selList[i].className.indexOf('seled') == -1) {
                  selList[i].className = selList[i].className + ' seled'
                }
              }
            }
          }
          clearEventBubble(evt)
        }

        that.$refs.dragBox.onmouseup = function(eve) {
          let flag = true
          for (var i = 0; i < selList.length; i++) {
            if (selList[i].className.indexOf('seled') != -1) {
              flag = false
            }
          }
          // 处理 点击没有移动的情况
          if (flag && (eve.target.getAttribute('data-date') || eve.target.parentNode.getAttribute('data-date'))) {
            if (eve.target.getAttribute('data-date')) {
              eve.target.className = eve.target.className + ' seled'
              selList.push(eve.target)
            } else if (eve.target.parentNode.getAttribute('data-date')) {
              eve.target.parentNode.className = eve.target.parentNode.className + ' seled'
              selList.push(eve.target.parentNode)
            }
          }
          isSelect = false
          if (selDiv) {
            // 处理小距离滑动 触发 只触发点击事件
            // if (selDiv.offsetWidth > 10 || selDiv.offsetHeight > 10) {
              showSelDiv(selList)
            // }
            document.body.removeChild(selDiv)
          }
          /* eslint-disable no-unused-expressions */
          /* eslint-disable no-sequences */
          selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null
        }
      })

      function clearEventBubble(evt) { // 默认事件的处理
        if (evt.stopPropagation) { evt.stopPropagation() } else { evt.cancelBubble = true }
        if (evt.preventDefault) { evt.preventDefault() } else { evt.returnValue = false }
      }
      function showSelDiv(arr) {
        if (!that.startDate) {
          that.$message({
            type: 'warning',
            message: '请先设置日历的开始时间和结束时间！'
          })
          return
        }
        // 获取选中节点数据
        that.selectDivData = []
        that.selectDate = []
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].className.indexOf('seled') != -1) {
            const dataDate = arr[i].getAttribute('data-date')
            const dataIndex = arr[i].getAttribute('data-index')
            const dataTitle = arr[i].getAttribute('data-title')
            if (dataDate) {
              that.selectDivData.push({
                calendarDate: dataDate,
                title: dataTitle,
                index: dataIndex
              })
              that.selectDate.push(dataDate)
            }
          }
        }
        // 获取每个日期下的数据
        that.selectDate = [...new Set(that.selectDate)]
        const selectForm = []
        that.selectDate.forEach(ele => {
          var arr = []
          that.selectDivData.forEach((param, index) => {
            if (param.calendarDate == ele) {
              arr.push(Number(param.index))
            }
          })
          selectForm.push({
            calendarDate: ele,
            calendarNodeList: arr
          })
        })
        if (selectForm.length == 0) { // 非区间内的点击框选
          return
        }
        // 把框选的数据合并到tableData上 -- 实现选中效果
        selectForm.forEach(ele => {
          that.tableData.forEach((data, index) => {
            if (data.nodeDate == ele.calendarDate) {
              const newCalendarNodeList = data.calendarNodeList.concat(ele.calendarNodeList)
              // 数组交集，或得两个数组重复的元素
              const SamePart = data.calendarNodeList.filter(item => ele.calendarNodeList.includes(item))
              // 差集=并集-交集  去除两个数组相同的元素
              const Difference = newCalendarNodeList.filter(item => !SamePart.includes(item))
              data.calendarNodeList = Difference
              that.$set(that.tableData, index, data)
            }
          })
        })
        // 转化为可提交的数据
        const arrList = []
        that.tableData.forEach(ele => {
          if (ele.nodeDate) {
            console.log(ele)
            arrList.push({ nodeDate: ele.nodeDate, calendarNodeList: ele.calendarNodeList })
          }
        })
        const params = {
          teachingCalendarNodeDTOList: arrList
        }
        that.teachingCalendarSaveNode(params)
      }
    })
  }
}

/* let arr1=[1,2,3,4,5,6]
let arr2=[4,5,6,7,8,9]
// 并集 数组去重
let RemoveSame=[...new Set([...arr1,...arr2])]
console.log(RemoveSame) //[1, 2, 3, 4, 5, 6, 7, 8, 9]

//数组交集，或得两个数组重复的元素
let SamePart=arr1.filter(item=>arr2.includes(item))
console.log(SamePart) //[4, 5, 6]

//差集=并集-交集  去除两个数组相同的元素
let Difference=RemoveSame.filter(item=>!SamePart.includes(item))
console.log(Difference) //[1, 2, 3, 7, 8, 9] */