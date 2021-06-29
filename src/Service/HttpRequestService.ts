/**
 * HttpRequestService.
 */
class HttpRequestService {

    /**
     * Make a request by the provided method and url.
     *
     * @param {string} method
     * @param {string} url
     * @private
     *
     * @return {Promise<object>}
     */
    public makeRequest(method: string, url: string): Promise<any> {

        return new Promise(function(resolve, reject) {

            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            xhr.onload = function() {

                if (this.status >= 200 && this.status < 300) {

                    resolve(xhr);

                } else {

                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });

                }

            };

            xhr.onerror = function() {

                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                });

            };

            xhr.send();

        });

    }

}

export default HttpRequestService;
