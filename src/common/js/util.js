// Storage utilities
export function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStore(key) {
  const value = localStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

// Token management
export function setToken(token, days = 7) {
  const expires = new Date()
  expires.setDate(expires.getDate() + days)
  document.cookie = `token=${token};expires=${expires.toUTCString()};path=/`
}

export function getToken() {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
  return match ? match[2] : null
}

// Subject volume management
export function setCookieSubjectVolume(volume) {
  const expires = new Date()
  expires.setDate(expires.getDate() + 30)
  document.cookie = `subjectVolume=${volume};expires=${expires.toUTCString()};path=/`
}

export function getCookieSubjectVolume() {
  const match = document.cookie.match(new RegExp('(^| )subjectVolume=([^;]+)'))
  return match ? match[2] : null
}

// Stage entrance management
export function getStageEntranceBySubject(subject) {
  const stageMap = {
    'primary': '/primary',
    'junior': '/junior',
    'senior': '/senior'
  }
  return stageMap[subject] || '/'
}

// DOM utilities
export function getElementXyHw(element) {
  if (!element) return { x: 0, y: 0, height: 0, width: 0 }
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left,
    y: rect.top,
    height: rect.height,
    width: rect.width
  }
}

// Scroll utility
export function ScrollIt(element, options = {}) {
  if (!element) return
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    ...options
  })
}

// Check if user is logged in
export function isLogin() {
  return localStorage.getItem('userInfo') !== null
}

// Combine parameters
export function combinParams(params) {
  return params || {}
}

// Flatten array
export function cpflattenFinal(arr) {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(cpflattenFinal(val)) : acc.concat(val), [])
}

export function reQuids(quids) {
  return quids
}

export function getSimpleCheckedNodes(nodes) {
  return nodes
}

// Simple encryption function
export function encrypt(data) {
  // Simple encryption placeholder
  return btoa(data);
}

// Remove token function
export function removeToken() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Session storage functions
export function getSessionStore(key) {
  return sessionStorage.getItem(key);
}

export function setSessionStore(key, value) {
  return sessionStorage.setItem(key, value);
}

export function removeSessionStore(key) {
  return sessionStorage.removeItem(key);
}

// Array extension find function
export function ArrayExtentFind(arr, key, value) {
  if (!arr || !Array.isArray(arr)) return null;
  return arr.find(item => item[key] === value) || null;
}

// Convert digital to Chinese
export function getDigitalChinese(num) {
  const chineseDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num <= 10) return chineseDigits[num];
  if (num < 20) return '十' + (num > 10 ? chineseDigits[num - 10] : '');
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  return chineseDigits[tens] + '十' + (ones > 0 ? chineseDigits[ones] : '');
}

// Decrypt function (counterpart to encrypt)
export function decrypt(data) {
  // Simple decryption placeholder
  return atob(data);
}
