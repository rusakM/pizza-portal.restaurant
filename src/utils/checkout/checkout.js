export const CHECKOUT_CATEGORIES = {
    PIZZA: 'pizzas',
    OWN_PIZZA: 'ownPizzas',
    DRINK: 'drinks',
    SAUCE: 'sauces',
};

export const CHECKOUT_CATEGORIES_NAMES = {
    pizzas: 'Pizze',
    ownPizzas: 'Własne pizze',
    drinks: 'Napoje',
    sauces: 'Sosy',
};

const INITIAL_CHECKOUT = {
    pizzas: [],
    ownPizzas: [],
    drinks: [],
    sauces: [],
};

class Checkout {
    constructor() {
        this.checkoutItems =
            parseInt(sessionStorage.getItem('checkoutItems')) || 0;
        this.checkout =
            JSON.parse(sessionStorage.getItem('checkout')) || INITIAL_CHECKOUT;
    }

    saveCheckoutToSessionStorage = () => {
        sessionStorage.setItem('checkout', JSON.stringify(this.checkout));
        sessionStorage.setItem('checkoutItems', `${this.checkoutItems}`);
    };

    addItem = (item, category) => {
        let isItemInCheckout = false;
        this.checkout[category].forEach((product, i) => {
            if (item._id === product._id) {
                isItemInCheckout = true;
                this.checkout[category][i].count++;
            }
        });
        if (!isItemInCheckout) {
            this.checkout[category].push({
                ...item,
                count: 1,
            });
        }
        this.checkoutItems++;
        this.saveCheckoutToSessionStorage();
    };

    removeItem = (id, category) => {
        let index = null;
        let count = 0;
        this.checkout[category].forEach((item, i) => {
            if (item._id === id) {
                index = i;
                count = item.count;
            }
        });
        if (count > 1) {
            this.checkout[category][index].count--;
        } else {
            this.checkout[category].splice(index, 1);
        }
        this.checkoutItems--;
        this.saveCheckoutToSessionStorage();
    };

    clearItem = (id, category) => {
        let index = null;
        let count = 0;
        this.checkout[category].forEach((item, i) => {
            if (item._id === id) {
                index = i;
                count = item.count;
            }
        });
        if (index >= 0 && count > 0) {
            this.checkout[category].splice(index, 1);
            this.checkoutItems -= count;
            this.saveCheckoutToSessionStorage();
        }
    };

    clearCheckout = () => {
        this.checkout = INITIAL_CHECKOUT;
        this.checkoutItems = 0;
        this.saveCheckoutToSessionStorage();
    };

    getCheckoutValue = () => {
        let value = 0;
        let c = Object.values(CHECKOUT_CATEGORIES);
        for (let i = 0; i < c.length; i++) {
            if (!this.checkout[c[i]]) {
                continue;
            }
            for (let j = 0; j < this.checkout[c[i]].length; j++) {
                const { count, price } = this.checkout[c[i]][j];
                value += count * price;
            }
        }
        return Math.round(value * 100) / 100;
    };

    createBooking = (address, isWithDelivery, isTakeAway, isPayNow) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            return null;
        }
        const booking = {
            isWithDelivery,
            isTakeAway,
            isPayNow,
        };
        booking.user = currentUser._id;

        const categories = Object.values(CHECKOUT_CATEGORIES);

        for (let category of categories) {
            const items = [];
            const templates = [];
            for (let item of this.checkout[category]) {
                for (let k = 0; k < item.count; k++) {
                    items.push(item._id);
                    if (category === CHECKOUT_CATEGORIES.PIZZA) {
                        templates.push(item.template.id);
                    }
                }
            }
            if (items.length > 0) {
                booking[category] = items;
            }
            if (templates.length > 0) {
                booking.templates = templates;
            }
        }
        if (address) {
            booking.address = address._id;
        }

        return booking;
    };
}

export default Checkout;
