function comma(val) {
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export { comma }
