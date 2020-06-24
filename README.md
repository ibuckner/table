# table

My take on building a more interactive HTML table. The build includes a starter CSS file, and two javascript versions for ES modules and current browsers. No serious attempt has been made towards ie11 compatibility.

## Installation

```shell
npm i --save @buckneri/table
```

## API

### Constructor

```javascript
const table = new Table({
  container: document.getElementById("table"),
  data: {
    headers: [{ value: "uuid", sort: false }, { value: "name", sort: true }],
    rows: [
      [{ value: 1 }, { value: "Robert" }], [{ value: 2 }, { value: "Jane" }]
    ]
  },
  locale: "en-GB",
  rows: 10
});
```

### Events

```javascript
"row-selected"
// emitted when table row is selected
```

### Methods

```javascript
table.data(data);
// stores and initialises data

table.destroy();
// self-destruct

table.draw();
// draws table to DOM

table.rowClickHandler();
// actions performed on row click

table.sortHandler();
// actions performed on column sort

table.toString();
// serialises the internal data
```

### Properties

```javascript
table.container
// parent element for table

table.locale
// locale code e.g. en-GB

table.rows
// number of rows to display
```
