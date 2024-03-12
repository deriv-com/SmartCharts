export function masterData() {
    const _date = new Date();
    _date.setMinutes(_date.getMinutes(), 0, 0);

    let price = 8350.41;
    price += parseFloat((price * 0.02 * Math.random() - price * 0.01).toFixed(2));
    const mock_items = [
        {
            Date: _date.toISOString().slice(0, 19),
            Close: price,
        },
    ];
    for (let i = 1; i < 10; i++) {
        const old_price = mock_items[mock_items.length - 1].Close;
        const change = old_price * 0.02 * Math.random() - old_price * 0.01; // random between +/-1% of current price
        const new_price = parseFloat(`${old_price + parseFloat(change.toFixed(2))}`).toFixed(4);
        _date.setMinutes(_date.getMinutes() - i * 2, 0, 0);
        const item = {
            Date: _date.toISOString().slice(0, 19),
            Open: parseFloat(new_price) - 10.5,
            High: parseFloat(new_price) + 15.5,
            Low: parseFloat(new_price) - 15,
            Close: parseFloat(new_price),
        };
        mock_items.push(item);
    }
    return mock_items;
}
