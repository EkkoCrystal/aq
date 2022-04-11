/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function checkFormBeginDate (form) {
  if (form.beginDate !== undefined) {
    if (form.beginDate === null) {
      return false
    } else {
      return true
    }
  } else {
    throw new Error('没有开始日期属性')
  }
}

export function checkFormEndDate (form) {
  if (form.endDate !== undefined) {
    if (form.endDate === null) {
      return false
    } else {
      return true
    }
  } else {
    throw new Error('没有结束日期属性')
  }
}

