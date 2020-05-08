import { Observable } from "rxjs";
export class HttpUtils {
  public static extractData(res: Response) {
    let body: any = res.json();
    return body.results || {};
  }

  public static handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);

    return Observable.throw(errMsg);
  }
}
