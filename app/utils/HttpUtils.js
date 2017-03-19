export default class HttpUtils {
    static get(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(responseJson => {
                    resolve(responseJson);
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    static post(url, option) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(option)
            })
                .then(response => response.json())
                .then(responseJson => {
                    resolve(responseJson);
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}