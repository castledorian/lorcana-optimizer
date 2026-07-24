export default class Card {
    constructor(data) {
        Object.assign(this, data);
    }

    get displayName() {
        return `${this.name}${this.version ? ' - ' + this.version : ''}`;
    }

    get isInkable() {
        return this.inkwell === true;
    }
}
