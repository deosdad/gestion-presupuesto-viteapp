import { v4 as uuid } from 'uuid';

export default class Expense{
    constructor(name, amount, date) {
        this.name = name;
        this.amount = Number(amount);
        this.date = date;
        this.id = uuid();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            amount: this.amount,
            date: this.date
        };
    }
}