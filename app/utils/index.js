export const generateMap = (list) => {
  const map = {};
  list.forEach(el => {
    map[el.id] = el
  })
  return map;
}
