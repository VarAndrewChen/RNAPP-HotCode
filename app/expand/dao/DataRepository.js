export default class DataRepository {
    fetchNetRepository(url) {
        return new Promise((resolve,reject) => {
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
}