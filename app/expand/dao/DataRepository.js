import {
    AsyncStorage
} from 'react-native';
import GitHubTrending from "GitHubTrending";
export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_my: 'my'};


export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
        if (flag === FLAG_STORAGE.flag_trending) this.trending = new GitHubTrending();
    }

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
            if (this.flag === FLAG_STORAGE.flag_trending) {
                this.trending.fetchTrending(url)
                    .then(result => {
                        if (!result) {
                            reject(new Error('Repository is null.'));
                            return;
                        }
                        this.save2Repository(url, result);
                    })
            } else {
                fetch(url)
                    .then(response => response.json())
                    .catch(error => {
                        reject(error);
                    })
                    .then(responseJson => {
                        if (!responseJson || !responseJson.items) {
                            reject(new Error('Repository is null.'));
                            return;
                        }
                        resolve(responseJson.items);
                        this.save2Repository(responseJson.items);
                    }).done();
            }
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
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        // return !((currentDate.getMonth() !== targetDate.getMonth()) || (currentDate.getDay() !== targetDate.getDay()) || (currentDate.getHours() - targetDate.getHours() > 4))
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        return true;
    }
}