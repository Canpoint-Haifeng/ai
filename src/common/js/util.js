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
