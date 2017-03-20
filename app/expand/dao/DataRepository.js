import {
    AsyncStorage
} from 'react-native'

export default class DataRepository {

    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            this.fetchLocalRepository(url)
                .then(result => {
                    if (result) {
                        resolve(result);
                    } else {
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result);
                            })
                            .catch(e => {
                                reject(e);
                            })
                    }
                })
                .catch(e => {
                    this.fetchNetRepository(url)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(e => {
                            reject(e);
                        })
                })
        })
    }

    /***
     * 获取网络数据
     * @param url
     * @return {Promise}
     */
    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(responseJson => {
                    if (!responseJson) {
                        reject(new Error('Repository is null.'));
                        return;
                    }
                    resolve(responseJson.items);
                    this.save2Repository(responseJson.items);
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    /***
     * 获取本地数据
     * @param url
     * @return {Promise}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            })
        })
    }

    /***
     * 保存到本地
     * @param url
     * @param data
     * @param callback
     */
    save2Repository(url, data, callback) {
        if (!url || !data) return;
        let wrapData = {item: data, update_data: new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    /***
     * 判断数据是否过时
     * @param longTime 数据的时间戳
     * @return {boolean}
     */
    checkDate(longTime) {
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        return !((cDate.getMonth() !== tDate.getMonth()) || (cDate.getDay() !== tDate.getDay()) || (cDate.getHours() - tDate.getHours() > 4))
    }
}