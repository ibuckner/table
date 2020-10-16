var chart = (function (exports) {
  'use strict';

  /* eslint-disable no-undefined,no-param-reassign,no-shadow */

  /**
   * Throttle execution of a function. Especially useful for rate limiting
   * execution of handlers on events like resize and scroll.
   *
   * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
   *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
   *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
   *                                    the internal counter is reset).
   * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
   *                                    to `callback` when the throttled-function is executed.
   * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
   *                                    schedule `callback` to execute after `delay` ms.
   *
   * @returns {Function}  A new, throttled, function.
   */
  function throttle (delay, noTrailing, callback, debounceMode) {
    /*
     * After wrapper has stopped being called, this timeout ensures that
     * `callback` is executed at the proper times in `throttle` and `end`
     * debounce modes.
     */
    var timeoutID;
    var cancelled = false; // Keep track of the last time `callback` was executed.

    var lastExec = 0; // Function to clear existing timeout

    function clearExistingTimeout() {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    } // Function to cancel next exec


    function cancel() {
      clearExistingTimeout();
      cancelled = true;
    } // `noTrailing` defaults to falsy.


    if (typeof noTrailing !== 'boolean') {
      debounceMode = callback;
      callback = noTrailing;
      noTrailing = undefined;
    }
    /*
     * The `wrapper` function encapsulates all of the throttling / debouncing
     * functionality and when executed will limit the rate at which `callback`
     * is executed.
     */


    function wrapper() {
      for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
        arguments_[_key] = arguments[_key];
      }

      var self = this;
      var elapsed = Date.now() - lastExec;

      if (cancelled) {
        return;
      } // Execute `callback` and update the `lastExec` timestamp.


      function exec() {
        lastExec = Date.now();
        callback.apply(self, arguments_);
      }
      /*
       * If `debounceMode` is true (at begin) this is used to clear the flag
       * to allow future `callback` executions.
       */


      function clear() {
        timeoutID = undefined;
      }

      if (debounceMode && !timeoutID) {
        /*
         * Since `wrapper` is being called for the first time and
         * `debounceMode` is true (at begin), execute `callback`.
         */
        exec();
      }

      clearExistingTimeout();

      if (debounceMode === undefined && elapsed > delay) {
        /*
         * In throttle mode, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec();
      } else if (noTrailing !== true) {
        /*
         * In trailing throttle mode, since `delay` time has not been
         * exceeded, schedule `callback` to execute `delay` ms after most
         * recent execution.
         *
         * If `debounceMode` is true (at begin), schedule `clear` to execute
         * after `delay` ms.
         *
         * If `debounceMode` is false (at end), schedule `callback` to
         * execute after `delay` ms.
         */
        timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
      }
    }

    wrapper.cancel = cancel; // Return the wrapper function.

    return wrapper;
  }

  /* eslint-disable no-undefined */
  /**
   * Debounce execution of a function. Debouncing, unlike throttling,
   * guarantees that a function is only executed a single time, either at the
   * very beginning of a series of calls, or at the very end.
   *
   * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
   *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
   *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
   * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
   *                                  to `callback` when the debounced-function is executed.
   *
   * @returns {Function} A new, debounced function.
   */

  function debounce (delay, atBegin, callback) {
    return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
  }

  var TableGrid = /** @class */ (function () {
      function TableGrid(options) {
          this.container = document.querySelector("body");
          this.locale = "en-GB";
          this.rows = 10;
          this._cursor = 0;
          this._data = [];
          this._header = [];
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
          if (options.header !== undefined) {
              this._header = options.header;
          }
      }
      /**
       * Clears out all rows and headers from table
       */
      TableGrid.prototype.clear = function () {
          this._data = [];
          this._header = [];
          if (this._thead) {
              this._thead.innerHTML = "";
          }
          if (this._tbody) {
              this._tbody.innerHTML = "";
          }
          return this;
      };
      /**
       * Saves data into TableGrid
       * @param data
       */
      TableGrid.prototype.data = function (rows) {
          var _this = this;
          if (Array.isArray(rows)) {
              rows.map(function (r) { return _this._data.push(r); });
          }
          else {
              this._data.push(rows);
          }
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
          this._createTable()
              ._drawHeader()
              ._drawRows()
              ._drawNavigation();
          return this;
      };
      /**
       * Actions to perform on row click
       * @param e
       */
      TableGrid.prototype.rowClickHandler = function (e) {
          var el = e.target;
          if (el.tagName === "TD") {
              el = el.parentNode;
          }
          else if (el.tagName !== "TR") {
              return;
          }
          window.dispatchEvent(new CustomEvent("row-selected", { detail: JSON.parse(el.dataset.row) }));
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
          this._scrollRows(this._cursor === 0 ? 0 : 1);
      };
      /**
       * Serialise the data
       */
      TableGrid.prototype.toString = function () {
          var dt = this._data.map(function (row) { return "" + row; }).join("\n");
          return "data:\n" + dt;
      };
      /**
       * Creates the basic table structure
       */
      TableGrid.prototype._createTable = function () {
          var _this = this;
          if (!this._id) {
              this._id = "table" + Array.from(document.querySelectorAll(".table")).length;
          }
          this._table = document.getElementById(this._id);
          if (!this._table) {
              var html = "<div class=\"table-grid\" id=\"" + this._id + "\">\n      <table>\n      <thead></thead>\n      <tbody></tbody>\n      </table>\n      </div>";
              this.container.innerHTML = html;
              this._table = document.getElementById(this._id);
              this._tbody = this._table.querySelector("tbody");
              this._tbody.addEventListener("click", function (event) { return _this.rowClickHandler(event); });
          }
          return this;
      };
      /**
       * Draws the table header
       */
      TableGrid.prototype._drawHeader = function () {
          var _this = this;
          var _a;
          if (!this._thead) {
              this._thead = (_a = this._table) === null || _a === void 0 ? void 0 : _a.querySelector("thead");
              var row_1 = document.createElement("tr");
              this._thead.appendChild(row_1);
              if (this._header && this._header.length > 0) {
                  this._header.forEach(function (cell) {
                      var th = document.createElement("th");
                      if (cell.sort) {
                          th.classList.add("column-sort");
                          th.addEventListener("click", function (e) { return _this.sortHandler(e); });
                      }
                      if (cell.label) {
                          th.title = cell.label;
                      }
                      th.textContent = "" + cell.value;
                      row_1.appendChild(th);
                      th.addEventListener("mouseenter", function (e) {
                          var el = e.target;
                          el.title = el.classList.contains("asc")
                              ? "Sorted in ascending order"
                              : el.classList.contains("desc")
                                  ? "Sorted in descending order"
                                  : "";
                      });
                  });
              }
          }
          return this;
      };
      /**
       * Draws the navigation footer
       */
      TableGrid.prototype._drawNavigation = function () {
          var _this = this;
          var _a;
          var self = this;
          var nav = this.container.querySelector("table + div.navigation");
          if (nav) {
              return this;
          }
          nav = document.createElement("div");
          nav.classList.add("navigation");
          nav.innerHTML = "<span class=\"bback disabled\" title=\"Move to first row\">\u25C0\u25C0</span>&nbsp;\n    <span class=\"back disabled\" title=\"Move one row back\">\u25C0</span>&nbsp;\n    <span class=\"forward\" title=\"Move one row forward\">\u25B6</span>&nbsp;\n    <span class=\"fforward\" title=\"Move to last row\">\u25B6\u25B6</span>";
          var table = (_a = this._table) === null || _a === void 0 ? void 0 : _a.querySelector("table");
          table === null || table === void 0 ? void 0 : table.insertAdjacentElement("afterend", nav);
          var nav2 = nav.cloneNode(true);
          table === null || table === void 0 ? void 0 : table.insertAdjacentElement("beforebegin", nav2);
          [nav, nav2].forEach(function (n) {
              var bb = n.querySelector(".bback");
              var b = n.querySelector(".back");
              var f = n.querySelector(".forward");
              var ff = n.querySelector(".fforward");
              var first = function () { return self._scrollRows(0); };
              var prev = function () { return self._scrollRows(-1); };
              var next = function () { return self._scrollRows(1); };
              var last = function () { return self._scrollRows(self._data.length); };
              var updateNav = function () {
                  [nav, nav2].forEach(function (n) {
                      var bb = n.querySelector(".bback");
                      var b = n.querySelector(".back");
                      var f = n.querySelector(".forward");
                      var ff = n.querySelector(".fforward");
                      bb.classList.remove("disabled");
                      b.classList.remove("disabled");
                      ff.classList.remove("disabled");
                      f.classList.remove("disabled");
                      if (_this._cursor === 0) {
                          bb.classList.add("disabled");
                          b.classList.add("disabled");
                      }
                      if (_this._cursor + _this.rows > _this._data.length - 1) {
                          ff.classList.add("disabled");
                          f.classList.add("disabled");
                      }
                  });
              };
              bb.addEventListener("click", debounce(250, function (_) { first(), updateNav(); }));
              b.addEventListener("mousedown", debounce(250, function (_) { prev(), updateNav(); }));
              f.addEventListener("mousedown", debounce(250, function (_) { next(), updateNav(); }));
              ff.addEventListener("click", debounce(250, function (_) { last(), updateNav(); }));
          });
          return this;
      };
      /**
       * Draws the table rows
       */
      TableGrid.prototype._drawRows = function () {
          var _this = this;
          var _a;
          var visibleRows = ((_a = this._tbody) === null || _a === void 0 ? void 0 : _a.querySelectorAll("tr.row:not(.hidden)").length) || 0;
          this._data.forEach(function (row, i) {
              var _a;
              if (!row.drawn) {
                  var tr = document.createElement("tr");
                  tr.classList.add("row");
                  if (visibleRows + 1 > _this.rows) {
                      tr.classList.add("hidden");
                  }
                  var html_1 = "";
                  row.cells.forEach(function (cell) {
                      html_1 += "<td";
                      if (cell.label) {
                          html_1 += " title=\"" + cell.label + "\"";
                      }
                      html_1 += ">";
                      if (cell.color) {
                          html_1 += "<div class=\"row-icon\" style=\"background-color:" + cell.color + "\"></div> ";
                      }
                      html_1 += cell.value + "</td>";
                  });
                  tr.innerHTML = html_1;
                  tr.dataset.row = JSON.stringify(row);
                  (_a = _this._tbody) === null || _a === void 0 ? void 0 : _a.appendChild(tr);
                  row.drawn = true;
              }
              ++visibleRows;
          });
          return this;
      };
      /**
       * Updates table rows on scroll
       * @param n relative number to scroll by
       */
      TableGrid.prototype._scrollRows = function (n) {
          var _a, _b;
          var rows = Array.from((_a = this._tbody) === null || _a === void 0 ? void 0 : _a.rows);
          var end = this._data.length - 1;
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
          if (end > this._data.length - 1) {
              end = this._data.length - 1;
              this._cursor = end - this.rows + 1;
          }
          if (this._cursor < 0) {
              this._cursor = 0;
              end = (this._data.length < this.rows ? this._data.length : this.rows) - 1;
          }
          var visible = Array.from((_b = this._tbody) === null || _b === void 0 ? void 0 : _b.querySelectorAll("tr:not(.hidden)"));
          visible.forEach(function (r) { return r.classList.add("hidden"); });
          for (var i = this._cursor; i <= end; i++) {
              rows[i].classList.remove("hidden");
          }
          return this;
      };
      return TableGrid;
  }());

  exports.TableGrid = TableGrid;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
