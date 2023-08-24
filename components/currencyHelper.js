// currencyHelper.js

function formatCurrency(amount) {
    return new Intl.NumberFormat("si-LK", {
        style: "currency",
        currency: "LKR"
    }).format(amount);
}

module.exports = {
    formatCurrency
};
