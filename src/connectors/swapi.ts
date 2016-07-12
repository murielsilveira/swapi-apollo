import * as request from 'request'


export default class SWAPIConnector {
  private rootURL: string

  constructor(rootURL: string) {
    this.rootURL = rootURL;
  }

  public fetch(resource: string) {
    const url = resource.indexOf(this.rootURL) === 0 ? resource : this.rootURL + resource

    return new Promise<any>((resolve, reject) => {
      request.get(url, (err, resp, body) => err ? reject(err) : resolve(JSON.parse(body)))
    })
  }

  public fetchPage(resource: string, offset?: number, limit?: number) {
    let results = []
    const size = limit || 0

    function pagination(pageURL: string) {
      return new Promise<any>((resolve, reject) => {
        this.fetch(pageURL).then((data) => {
          if (size > 0 && size - results.length - data.results.length < 0) {
            results = results.concat(data.results.slice(0, size - results.length))
          } else {
            results = results.concat(data.results)
          }
          console.log(`first: ${size} size: ${results.length} ${pageURL}`)
          if (data.next && (size === 0 || size - results.length > 0)) {
            pagination.call(this, data.next).then(resolve)
          } else {
            resolve(results)
          }
        })
      })
    }

    return pagination.call(this, resource);
  }
}
