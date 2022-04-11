/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

export function addPrintStyle (iframe) {
  const styleClass =
      `.table,
.table * {
  margin: 0 auto;
  padding: 0;
  font-size: 14px;
  font-family: Arial, 宋体, Helvetica, sans-serif;
}
.table {
  display: table;
  width: 1024px;
  border-collapse: collapse;
}
.table-tr {
  display: table-row;
  height: 30px;
}
.table-th {
  display: table-cell;
  font-weight: bold;
  height: 100%;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
}

.table-td {
  display: table-cell;
  line-height: 20px;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  width: 80px;
  padding: 8px;
}

.table-td-lg {
  display: table-cell;
  line-height: 20px;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  width: 110px;
  padding: 5px;
}

.table-td-xlg {
  display: table-cell;
  line-height: 20px;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  width: 130px;
  padding: 5px;
}

.head-td {
  display:table-cell;
  line-height:20px;
  text-align:left;
  vertical-align:middle;
  width:160px;
  padding:5px;
}

.head-caption{
  display:table-cell;
  font-size:16pt;
  line-height:16pt;
  width:960px;
  padding:5px;
}


.print-footer{

  position:fixed;bottom:5px; right:10px

}

.Low {
  color: blue;
}
.High {
  color: red;
}
`
  const style = iframe.document.createElement('style')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.innerHTML = styleClass
  iframe.document.body.appendChild(style)
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
