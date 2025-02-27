import axios from 'axios'
export function sendGoodQuestionCount(questionId, type) {
  if (!(questionId && type)) {
    return
  }
  let url =
    'https://api.canpoint.cn/paper-generator/apiGateway/apiGetData'

  let params = {
    apiUrl: '/count/question',
    apiId: 101784,
    paramJson: JSON.stringify({
      questionId: questionId,
      type: type,
    }),
    httpMethod: 'get',
  }
  axios.get(url, { params: params }).then(
    () => {},
    () => {},
  )
}
