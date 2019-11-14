export const generateMap = (list) => {
  const map = {};
  list.forEach(el => {
    map[el.id] = el
  })
  return map;
}

export const debounce = (fn, msec=500) => {
  let timer = null;
  return (...rest) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...rest);
    }, msec);
  }
}