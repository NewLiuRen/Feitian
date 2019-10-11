export const compareObject = (baseObj, obj) => {
  const keys = Object.keys(obj);

  for (let k of keys) {
    if (! k in baseObj) throw new Error(`参数错误：属性【${k}】，不存在于基础对象当中`)
  }
}
