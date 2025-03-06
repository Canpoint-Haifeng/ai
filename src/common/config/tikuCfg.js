// Basic configuration for tiku
export default {
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.example.com' : 'http://localhost:3000',
  apiVersion: 'v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
}

// Configuration for paper index turn
export const paperIndexTurnConfig = [
  {
    period: '2',
    address: 'https://www.canpointgz.cn/book.html?subject=2'
  },
  {
    period: '1',
    address: 'https://www.canpointgz.cn/book.html?subject=1'
  },
  {
    period: '3',
    address: 'https://www.canpointgz.cn/book.html?subject=3'
  }
]
