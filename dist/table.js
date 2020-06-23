var TableGrid = /** @class */ (function () {
    function TableGrid(options) {
        this.container = document.querySelector("body");
        this.locale = "en-GB";
        this.rows = 10;
        this._cursor = 0;
        this._data = { headers: [], rows: [] };
        this._id = "";
        this._table = null;
        this._tbody = null;
        this._thead = null;
        if (options.locale !== undefined) {
            this.locale = options.locale;
        }
        if (options.container !== undefined) {
            this.container = options.container;
        }
        if (options.rows !== undefined) {
            this.rows = options.rows;
        }
        this.data(options.data);
    }
    /**
     * Creates the basic table structure
     */
    TableGrid.prototype.createTable = function () {
        var html = "<div class=\"table-grid\">";
        html += "<table id=\"" + this._id + "\"><thead></thead><tbody></tbody></table>";
        html += "</div>";
        this.container.innerHTML = html;
        this._table = document.getElementById(this._id);
        this._tbody = this._table.querySelector("tbody");
        return this;
    };
    /**
     * Saves data into Table
     * @param data
     */
    TableGrid.prototype.data = function (data) {
        this._data = data;
        this._id = "table" + Array.from(document.querySelectorAll(".table")).length;
        return this;
    };
    /**
     * Removes this table from the DOM
     */
    TableGrid.prototype.destroy = function () {
        this.container.removeChild(this.container.querySelector("table"));
        return this;
    };
    /**
     * Draws the table
     */
    TableGrid.prototype.draw = function () {
        this.createTable()
            .drawHeader()
            .drawRows()
            .drawNavigation();
        return this;
    };
    /**
     * Draws the table header
     */
    TableGrid.prototype.drawHeader = function () {
        var _this = this;
        this._thead = this._table.querySelector("thead");
        var row = document.createElement("tr");
        this._thead.appendChild(row);
        this._data.headers.forEach(function (cell) {
            var th = document.createElement("th");
            if (cell.sort) {
                th.classList.add("column-sort");
                th.addEventListener("click", function (e) { return _this.sortHandler(e); });
            }
            if (cell.label) {
                th.title = cell.label;
            }
            th.textContent = "" + cell.value;
            row.appendChild(th);
            th.addEventListener("mouseenter", function (e) {
                var el = e.target;
                el.title = el.classList.contains("asc")
                    ? "Sorted in ascending order"
                    : el.classList.contains("desc")
                        ? "Sorted in descending order"
                        : "";
            });
        });
        return this;
    };
    /**
     * Draws the navigation footer
     */
    TableGrid.prototype.drawNavigation = function () {
        var _this = this;
        var _a;
        var self = this;
        var nav = document.createElement("div");
        nav.classList.add("navigation");
        (_a = this._table) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("afterend", nav);
        nav.innerHTML = "<span class=\"bback disabled\" title=\"Move to first row\">&lt;&lt;</span>&nbsp;";
        nav.innerHTML += "<span class=\"back disabled\" title=\"Move one row back (hold to scroll)\">&lt;</span>&nbsp;";
        nav.innerHTML += "<span class=\"forward\" title=\"Move one row forward (hold to scroll)\">&gt;</span>&nbsp;";
        nav.innerHTML += "<span class=\"fforward\" title=\"Move to last row\">&gt;&gt;</span>";
        var bb = nav.querySelector(".bback");
        var b = nav.querySelector(".back");
        var f = nav.querySelector(".forward");
        var ff = nav.querySelector(".fforward");
        var timer;
        var first = function (_) { return _this.scrollRows(0); };
        var prev = function (_) {
            _this.scrollRows(-1);
            timer ? clearInterval(timer) : timer;
            timer = setInterval(function () { return self.scrollRows(-1); }, 250);
        };
        var next = function (_) {
            _this.scrollRows(1);
            timer ? clearInterval(timer) : timer;
            timer = setInterval(function () { return self.scrollRows(1); }, 250);
        };
        var last = function (_) { return _this.scrollRows(_this._data.rows.length); };
        var show = function (_) {
            clearInterval(timer);
            bb.classList.remove("disabled");
            b.classList.remove("disabled");
            ff.classList.remove("disabled");
            f.classList.remove("disabled");
            if (_this._cursor === 0) {
                bb.classList.add("disabled");
                b.classList.add("disabled");
            }
            if (_this._cursor + _this.rows > _this._data.rows.length - 1) {
                ff.classList.add("disabled");
                f.classList.add("disabled");
            }
        };
        bb.addEventListener("click", first);
        b.addEventListener("mousedown", prev);
        f.addEventListener("mousedown", next);
        ff.addEventListener("click", last);
        nav.addEventListener("mouseup", show);
        nav.addEventListener("mouseleave", show);
        return this;
    };
    /**
     * Draws the table rows
     */
    TableGrid.prototype.drawRows = function () {
        var _this = this;
        this._data.rows.forEach(function (rows, i) {
            var _a;
            var tr = document.createElement("tr");
            if (_this.rows < i + 1) {
                tr.classList.add("hidden");
            }
            var html = "";
            rows.forEach(function (cell) {
                html += "<td";
                if (cell.label) {
                    html += " title=\"" + cell.label + "\"";
                }
                html += ">" + cell.value + "</td>";
            });
            tr.innerHTML = html;
            (_a = _this._tbody) === null || _a === void 0 ? void 0 : _a.appendChild(tr);
        });
        return this;
    };
    /**
     * Updates table rows on scroll
     * @param n relative number to scroll by
     */
    TableGrid.prototype.scrollRows = function (n) {
        var _a, _b;
        var rows = Array.from((_a = this._tbody) === null || _a === void 0 ? void 0 : _a.rows);
        var end = this._data.rows.length - 1;
        if (n === 0) {
            this._cursor = 0;
            end = end > this.rows - 1 ? this.rows - 1 : end;
        }
        else if (n === end + 1) {
            this._cursor = end - this.rows + 1;
        }
        else {
            this._cursor += n;
            end = this._cursor + this.rows - 1;
        }
        if (end > this._data.rows.length - 1) {
            end = this._data.rows.length - 1;
            this._cursor = end - this.rows + 1;
        }
        if (this._cursor < 0) {
            this._cursor = 0;
            end = (this._data.rows.length < this.rows ? this._data.rows.length : this.rows) - 1;
        }
        var visible = Array.from((_b = this._tbody) === null || _b === void 0 ? void 0 : _b.querySelectorAll("tr:not(.hidden)"));
        visible.forEach(function (r) { return r.classList.add("hidden"); });
        for (var i = this._cursor; i <= end; i++) {
            rows[i].classList.remove("hidden");
        }
        return this;
    };
    /**
     * Provides the sorting logic for the table columns
     * @param e
     */
    TableGrid.prototype.sortHandler = function (e) {
        var _this = this;
        var _a, _b;
        var isDate = function (d) { try {
            return !isNaN((new Date(d)).getTime());
        }
        catch (_a) { } return false; };
        var el = e.target;
        var cl = el.classList.contains("asc") ? "desc" : "asc";
        var columns = Array.from((_a = this._thead) === null || _a === void 0 ? void 0 : _a.querySelectorAll("th"));
        columns.forEach(function (c) { return c.classList.remove("asc", "desc"); });
        el.classList.add(cl);
        var cellIndex = el.cellIndex;
        var rows = Array.from((_b = this._tbody) === null || _b === void 0 ? void 0 : _b.rows);
        rows.sort(function (a, b) {
            var index;
            var cellA = a.cells[cellIndex];
            var cellB = b.cells[cellIndex];
            var testA, testB;
            if (!isNaN(cellA.textContent || "") && !isNaN(cellB.textContent || "")) {
                testA = +(cellA.textContent || 0);
                testB = +(cellB.textContent || 0);
            }
            else if (isDate(cellA.textContent || "") && isDate(cellB.textContent || "")) {
                testA = new Date(cellA.textContent);
                testB = new Date(cellB.textContent);
            }
            else {
                testA = cellA.textContent || "";
                testB = cellB.textContent || "";
            }
            if (cl === "asc") {
                index = testA > testB ? 1 : -1;
            }
            else {
                index = testA < testB ? 1 : -1;
            }
            return index;
        });
        rows.forEach(function (row) {
            var _a, _b;
            (_a = row.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(row);
            (_b = _this._tbody) === null || _b === void 0 ? void 0 : _b.appendChild(row);
        });
        this._cursor = this._cursor === 0 ? 0 : this._cursor - 1;
        this.scrollRows(this._cursor === 0 ? 0 : 1);
    };
    /**
     * Serialise the data
     */
    TableGrid.prototype.toString = function () {
        var dt = this._data.rows.map(function (n) { return "" + n; }).join("\n");
        return "data:\n" + dt;
    };
    return TableGrid;
}());

export { TableGrid };
