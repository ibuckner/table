import { debounce } from "throttle-debounce";

export type TTableCell = {
  color?: string,
  label?: string,
  value: string | number | Date
};

export type TTableHeaderCell = {
  label?: string,
  value: string | number | Date,
  sort: boolean
};

export type TTableRow = {
  cells: TTableCell[];
  drawn?: boolean
};

export type TTableOptions = {
  container: HTMLElement,
  header: TTableHeaderCell[];
  locale?: string,
  rows?: number
};

export class TableGrid {
  public container: HTMLElement = document.querySelector("body") as HTMLElement;
  public locale: string = "en-GB";
  public rows: number = 10;

  private _cursor: number = 0;
  private _data: TTableRow[] = [];
  private _header: TTableHeaderCell[] = [];
  private _id: string = "";
  private _table: HTMLElement | null = null;
  private _tbody: HTMLTableSectionElement | null = null;
  private _thead: HTMLTableSectionElement | null = null;

  constructor(options: TTableOptions) {
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
  public clear(): TableGrid {
    this._data = [];
    this._header = [];
    if (this._thead) {
      this._thead.innerHTML = "";
    }
    if (this._tbody) {
      this._tbody.innerHTML = "";
    }
    return this;
  }

  /**
   * Saves data into TableGrid
   * @param data
   */
  public data(rows: TTableRow | TTableRow[]): TableGrid {
    if (Array.isArray(rows)) {
      rows.map((r: TTableRow) => this._data.push(r));
    } else {
      this._data.push(rows);
    }
    return this;
  }

  /**
   * Removes this table from the DOM
   */
  public destroy(): TableGrid {
    this.container.removeChild(this.container.querySelector("table") as HTMLTableElement);
    return this;
  }

  /**
   * Draws the table
   */
  public draw(): TableGrid {
    this._createTable()
        ._drawHeader()
        ._drawRows()
        ._drawNavigation();
    return this;
  }

  /**
   * Actions to perform on row click
   * @param e 
   */
  public rowClickHandler(e: MouseEvent): void {
    let el = e.target as HTMLElement;
    if (el.tagName === "TD") {
      el = el.parentNode as HTMLElement;
    } else if (el.tagName !== "TR") {
      return;
    }
    window.dispatchEvent(new CustomEvent("row-selected", { detail: JSON.parse(el.dataset.row as string) }));
  }

  /**
   * Provides the sorting logic for the table columns
   * @param e 
   */
  public sortHandler(e: MouseEvent): void {
    const isDate: Function = (d: string) => { try { return !isNaN((new Date(d)).getTime()); } catch {} return false; };
    const el: HTMLTableHeaderCellElement = e.target as HTMLTableHeaderCellElement;
    let cl = el.classList.contains("asc") ? "desc" : "asc";
    const columns: HTMLTableHeaderCellElement[] = Array.from(this._thead?.querySelectorAll("th") as NodeListOf<HTMLTableHeaderCellElement>);
    columns.forEach((c: HTMLTableHeaderCellElement) => c.classList.remove("asc", "desc"));
    el.classList.add(cl);
    const cellIndex = el.cellIndex;
    const rows = Array.from(this._tbody?.rows as HTMLCollectionOf<HTMLTableRowElement>);
    rows.sort((a: HTMLTableRowElement, b: HTMLTableRowElement) => {
      let index;
      let cellA = a.cells[cellIndex] as HTMLTableCellElement;
      let cellB = b.cells[cellIndex] as HTMLTableCellElement;
      let testA, testB;
      if (!isNaN(cellA.textContent || "" as any) && !isNaN(cellB.textContent || "" as any)) {
        testA = +(cellA.textContent || 0);
        testB = +(cellB.textContent || 0);
      } else if (isDate(cellA.textContent || "" as any) && isDate(cellB.textContent || "" as any)) {
        testA = new Date(cellA.textContent as any);
        testB = new Date(cellB.textContent as any);
      } else {
        testA = cellA.textContent || "";
        testB = cellB.textContent || "";
      }
      if (cl === "asc") {
        index = testA > testB ? 1 : -1;
      } else {
        index = testA < testB ? 1 : -1;
      }
      return index;
    });
    rows.forEach((row: HTMLTableRowElement) => {
      row.parentNode?.removeChild(row);
      this._tbody?.appendChild(row);
    });
    this._cursor = this._cursor === 0 ? 0 : this._cursor - 1;
    this._scrollRows(this._cursor === 0 ? 0 : 1);
  }

  /**
   * Serialise the data
   */
  public toString(): string {
    let dt: string = this._data.map((row: any) => `${row}`).join("\n");
    return `data:\n${dt}`;
  }

  /**
   * Creates the basic table structure
   */
  private _createTable(): TableGrid {
    if (!this._id) {
      this._id = "table" + Array.from(document.querySelectorAll("table")).length;
    }
    this._table = document.getElementById(this._id) as HTMLTableElement;
    if (!this._table) {
      let html = `<div class="table-grid" id="${this._id}">
      <table>
      <thead></thead>
      <tbody></tbody>
      </table>
      </div>`;
      this.container.innerHTML = html;
      this._table = document.getElementById(this._id) as HTMLElement;
      this._tbody = this._table.querySelector("tbody") as HTMLTableSectionElement;
      this._tbody.addEventListener("click", (event: MouseEvent) => this.rowClickHandler(event));
    }
    return this;
  }

  /**
   * Draws the table header
   */
  private _drawHeader(): TableGrid {
    if (!this._thead) {
      this._thead = this._table?.querySelector("thead") as HTMLTableSectionElement;
      const row = document.createElement("tr");
      this._thead.appendChild(row);
      if (this._header && this._header.length > 0) {
        this._header.forEach((cell: TTableHeaderCell) => {
          const th: HTMLTableHeaderCellElement = document.createElement("th");
          if (cell.sort) {
            th.classList.add("column-sort");
            th.addEventListener("click", (e: MouseEvent) => this.sortHandler(e));
          }
          if (cell.label) {
            th.title = cell.label;
          }
          th.textContent = `${cell.value}`;
          row.appendChild(th);
          th.addEventListener("mouseenter", (e: MouseEvent) => {
            const el = e.target as HTMLTableHeaderCellElement;
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
  }

  /**
   * Draws the navigation footer
   */
  private _drawNavigation(): TableGrid {
    const self = this;
    let nav = this.container.querySelector("table + div.navigation") as HTMLElement;
    if (nav) {
      return this;
    }

    nav = document.createElement("div");
    nav.classList.add("navigation");
    nav.innerHTML = `<span class="bback disabled" title="Move to first row">◀◀</span>&nbsp;
    <span class="back disabled" title="Move one row back">◀</span>&nbsp;
    <span class="forward" title="Move one row forward">▶</span>&nbsp;
    <span class="fforward" title="Move to last row">▶▶</span>`;

    const table = this._table?.querySelector("table");
    table?.insertAdjacentElement("afterend", nav);
    const nav2 = nav.cloneNode(true) as HTMLElement;
    table?.insertAdjacentElement("beforebegin", nav2);

    [nav, nav2].forEach((n: HTMLElement) => {
      const bb = n.querySelector(".bback") as HTMLSpanElement;
      const b = n.querySelector(".back") as HTMLSpanElement;
      const f = n.querySelector(".forward") as HTMLSpanElement;
      const ff = n.querySelector(".fforward") as HTMLSpanElement;

      const first = () => self._scrollRows(0);
      const prev = () => self._scrollRows(-1);
      const next = () => self._scrollRows(1);
      const last = () => self._scrollRows(self._data.length);
      const updateNav = () => {
        [nav, nav2].forEach((n: HTMLElement) => {
          const bb = n.querySelector(".bback") as HTMLSpanElement;
          const b = n.querySelector(".back") as HTMLSpanElement;
          const f = n.querySelector(".forward") as HTMLSpanElement;
          const ff = n.querySelector(".fforward") as HTMLSpanElement;

          bb.classList.remove("disabled");
          b.classList.remove("disabled");
          ff.classList.remove("disabled");
          f.classList.remove("disabled");
          if (this._cursor === 0) {
            bb.classList.add("disabled");
            b.classList.add("disabled");
          }
          if (this._cursor + this.rows > this._data.length - 1) {
            ff.classList.add("disabled");
            f.classList.add("disabled");
          }
        });
      };
      bb.addEventListener("click", debounce(250, _ => { first(), updateNav(); }));
      b.addEventListener("mousedown", debounce(250, _ => { prev(), updateNav(); }));
      f.addEventListener("mousedown", debounce(250, _ => { next(), updateNav(); }));
      ff.addEventListener("click", debounce(250, _ => { last(), updateNav(); }));
    });

    return this;
  }

  /**
   * Draws the table rows
   */
  private _drawRows(): TableGrid {
    let visibleRows = this._tbody?.querySelectorAll("tr.row:not(.hidden)").length || 0;
    this._data.forEach((row: TTableRow, i: number) => {
      if (!row.drawn) {
        const tr: HTMLTableRowElement = document.createElement("tr");
        tr.classList.add("row");
        if (visibleRows + 1 > this.rows) {
          tr.classList.add("hidden");
        }
        let html = "";
        row.cells.forEach((cell: TTableCell) => {
          html += `<td class="ellipsis" title="${cell.label ? cell.label : cell.value}">
          <span>${cell.color ? `<div class="row-icon" style="background-color:${cell.color}"></div>` : ``}
          ${cell.value}</span>
          </td>`;
        });
        tr.innerHTML = html;
        tr.dataset.row = JSON.stringify(row);
        this._tbody?.appendChild(tr);
        row.drawn = true;
      }
      ++visibleRows;
    });
    return this;
  }

  /**
   * Updates table rows on scroll
   * @param n relative number to scroll by
   */
  private _scrollRows(n: number): TableGrid {
    const rows: HTMLTableRowElement[] = Array.from(this._tbody?.rows as HTMLCollectionOf<HTMLTableRowElement>);
    let end: number = this._data.length - 1;
    if (n === 0) {
      this._cursor = 0;
      end = end > this.rows - 1 ? this.rows - 1 : end;
    } else if (n === end + 1) {
      this._cursor = end - this.rows + 1;
    } else {
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

    const visible: HTMLTableRowElement[] = Array.from(this._tbody?.querySelectorAll("tr:not(.hidden)") as NodeListOf<HTMLTableRowElement>);
    visible.forEach((r: HTMLTableRowElement) => r.classList.add("hidden"));

    for (let i = this._cursor; i <= end; i++) {
      rows[i].classList.remove("hidden");
    }

    return this;
  }
}
