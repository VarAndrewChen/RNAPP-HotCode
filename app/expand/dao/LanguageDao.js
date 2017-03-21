import {AsyncStorage} from 'react-native';
import keysData from '../../../res/data/keys.json';
import langsData from '../../../res/data/langs.json';

export let FLAG_LANGUAGE = {flag_language: 'flag_language_language', flag_key: 'flag_language_key'};
export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }
     static init(flag) {
        return new LanguageDao(flag);
    }
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (!error) {
                    if (result) {
                        try {
                            resolve(JSON.parse(result));
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        let data = this.flag === FLAG_LANGUAGE.flag_key ? keysData : langsData;
                        this.save(data);
                        resolve(data);
                    }
                }
                reject(error);
            });
        });
    }
    save(data) {
        AsyncStorage.setItem(this.flag,JSON.stringify(data),(error) => {});
    }
}