// 截取字符串前几位
const disName = '开心一族漂亮家园'
const shortName = disName.substring(0, 2)
console.log(shortName) // 打印结果：开心一族漂

// 截取字符串后几位
const disLength = disName.length
const shortName2 = disName.substring(disLength - 2, disLength)
console.log(shortName2) // 打印结果：家园
