export const compareObject = (baseObj, obj) => {
  const keys = Object.keys(obj);

  for (const k of keys) {
    if (k !== 'id' && !( k in baseObj)) throw new Error(`参数错误：属性【${k}】，不存在于基础对象属性当中，基础对象属性为：【 ${Object.keys(baseObj).join(',')} 】`)
  }
}

export default compareObject
