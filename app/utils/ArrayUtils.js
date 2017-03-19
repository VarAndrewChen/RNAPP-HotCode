export default class ArrayUtils {


    /***
     * 更新数组，若item已存在则从数组中将它移除，否则添加进数组
     * @param array
     * @param item
     */
    static updateArray(array, item) {
        for (let i = 0; i < array.length; i++) {
            let temp = array[i];
            if (temp === item) {
                array.slice(i, 1);
                return;
            }
        }
        array.push(item);
    }

    /***
     * 克隆数组
     * @param target
     * @return {string|Blob|ArrayBuffer|Array.<T>|RouteStack}
     */
    static clone(target) {
        return target.slice();
    }

    /***
     * 判断两个数组是否相等
     * @param arr1
     * @param arr2
     * @return {boolean}
     */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false;
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
}