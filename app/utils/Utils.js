export default class Utils {
    static checkFavorite(item,items) {
        return items.includes(item.id.toString());
    }
}