import alerts from "../../utils/alerts";
import getErrorMessage from "./getErrorMessage";

class ResponseError {
  constructor(response) {
    ResponseError.checkResponse(response);
    this.errorType = response?.errorType;
    this.status = Number(response?.status);
    this.response = response;
    this.message = getErrorMessage(response);
    this.problem = response.problem;
  }

  static checkResponse(response) {
    if (response?.ok === undefined) {
      throw response;
    }
  }

  setMessage = (message) => {
    this.message = message;
    return this;
  };

  alertMessage = () => {
    if (this.message) alerts.alertError(this.message);
  };

  check = (status, errorType) => {
    let positive = true;
    if (status && Number(status) !== this.status) {
      positive = false;
    }
    if (errorType !== this.errorType) {
      positive = false;
    }
    return positive;
  };
}

export default ResponseError;
