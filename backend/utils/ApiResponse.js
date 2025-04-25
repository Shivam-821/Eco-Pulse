// access data in frontend using data.data fomrat like: const response = axios.get()    
// const data = response.data.data
class ApiResponse {
  constructor(statusCode, data, message = "Success") {

    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
