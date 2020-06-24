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

export type TTable = {
  headers: TTableHeaderCell[],
  rows: TTableCell[][]
};

export type TTableOptions = {
  container: HTMLElement,
  data: TTable[],
  locale?: string,
  rows?: number
};

export class TableGrid {
  public container: HTMLElement = document.querySelector("body") as HTMLElement;
  public locale: string = "en-GB";
  public rows: number = 10;

  private _cursor: number = 0;
  private _data: TTable = { headers: [], rows: []};
  private _id: string = "";
  private _table: HTMLTableElement | null = null;
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

    this.data(options.data);
  }

  /**
   * Saves data into Table
   * @param data
   */
  public data(data: any): TableGrid {
    this._data = data;
    this._id = "table" + Array.from(document.querySelectorAll(".table")).length;
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
    let dt: string = this._data.rows.map((n: any) => `${n}`).join("\n");
    return `data:\n${dt}`;
  }

  /**
   * Creates the basic table structure
   */
  private _createTable(): TableGrid {
    let html = `<div class="table-grid">`;
    html += `<table id="${this._id}"><thead></thead><tbody></tbody></table>`;
    html += `</div>`;
    this.container.innerHTML = html;
    this._table = document.getElementById(this._id) as HTMLTableElement;
    this._tbody = this._table.querySelector("tbody") as HTMLTableSectionElement;
    this._tbody.addEventListener("click", (event: MouseEvent) => this.rowClickHandler(event));
    return this;
  }

  /**
   * Draws the table header
   */
  private _drawHeader(): TableGrid {
    this._thead = (this._table as HTMLTableElement).querySelector("thead") as HTMLTableSectionElement;
    const row = document.createElement("tr");
    this._thead.appendChild(row);
    this._data.headers.forEach((cell: TTableHeaderCell) => {
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
    return this;
  }

  /**
   * Draws the navigation footer
   */
  private _drawNavigation(): TableGrid {
    const self = this;
    const nav = document.createElement("div");
    nav.classList.add("navigation");
    this._table?.insertAdjacentElement("afterend", nav);
    nav.innerHTML = `<span class="bback disabled" title="Move to first row">&lt;&lt;</span>&nbsp;`;
    nav.innerHTML += `<span class="back disabled" title="Move one row back (hold to scroll)">&lt;</span>&nbsp;`;
    nav.innerHTML += `<span class="forward" title="Move one row forward (hold to scroll)">&gt;</span>&nbsp;`;
    nav.innerHTML += `<span class="fforward" title="Move to last row">&gt;&gt;</span>`;

    const bb = nav.querySelector(".bback") as HTMLSpanElement;
    const b = nav.querySelector(".back") as HTMLSpanElement;
    const f = nav.querySelector(".forward") as HTMLSpanElement;
    const ff = nav.querySelector(".fforward") as HTMLSpanElement;

    let hold = false, timer: NodeJS.Timeout;
    const first = (_: MouseEvent) => this._scrollRows(0);
    const prev = (_: MouseEvent) => {
      this._scrollRows(-1);
      timer ? clearInterval(timer) : timer;
      timer = setInterval(() => self._scrollRows(-1), 250);
    };
    const next = (_: MouseEvent) => {
      this._scrollRows(1);
      timer ? clearInterval(timer) : timer;
      timer = setInterval(() => self._scrollRows(1), 250);
    };
    const last = (_: MouseEvent) => this._scrollRows(this._data.rows.length);
    const show = (_: MouseEvent) => {
      hold = false;
      clearInterval(timer);
      bb.classList.remove("disabled");
      b.classList.remove("disabled");
      ff.classList.remove("disabled");
      f.classList.remove("disabled");
      if (this._cursor === 0) {
        bb.classList.add("disabled");
        b.classList.add("disabled");
      }
      if (this._cursor + this.rows > this._data.rows.length - 1) {
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
  }

  /**
   * Draws the table rows
   */
  private _drawRows(): TableGrid {
    this._data.rows.forEach((rows: TTableCell[], i: number) => {
      const tr: HTMLTableRowElement = document.createElement("tr");
      tr.classList.add("row");
      if (this.rows < i + 1) {
        tr.classList.add("hidden");
      }
      let html = "";
      rows.forEach((cell: TTableCell) => {
        html += "<td";
        if (cell.label) {
          html += ` title="${cell.label}"`;
        }
        html += ">";
        if (cell.color) {
          html += `<div class="row-icon" style="background-color:${cell.color}"></div> `;
        }
        html += `${cell.value}</td>`;
      });
      tr.innerHTML = html;
      tr.dataset.row = JSON.stringify(rows);
      this._tbody?.appendChild(tr);
    });
    return this;
  }

  /**
   * Updates table rows on scroll
   * @param n relative number to scroll by
   */
  private _scrollRows(n: number): TableGrid {
    const rows: HTMLTableRowElement[] = Array.from(this._tbody?.rows as HTMLCollectionOf<HTMLTableRowElement>);
    let end: number = this._data.rows.length - 1;

    if (n === 0) {
      this._cursor = 0;
      end = end > this.rows - 1 ? this.rows - 1 : end;
    } else if (n === end + 1) {
      this._cursor = end - this.rows + 1;
    } else {
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

    const visible: HTMLTableRowElement[] = Array.from(this._tbody?.querySelectorAll("tr:not(.hidden)") as NodeListOf<HTMLTableRowElement>);
    visible.forEach((r: HTMLTableRowElement) => r.classList.add("hidden"));

    for (let i = this._cursor; i <= end; i++) {
      rows[i].classList.remove("hidden");
    }

    return this;
  }
}
