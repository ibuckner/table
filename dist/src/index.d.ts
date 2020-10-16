export declare type TTableCell = {
    color?: string;
    label?: string;
    value: string | number | Date;
};
export declare type TTableHeaderCell = {
    label?: string;
    value: string | number | Date;
    sort: boolean;
};
export declare type TTableRow = {
    cells: TTableCell[];
    drawn?: boolean;
};
export declare type TTableOptions = {
    container: HTMLElement;
    locale?: string;
    rows?: number;
};
export declare class TableGrid {
    container: HTMLElement;
    locale: string;
    rows: number;
    private _cursor;
    private _data;
    private _header;
    private _id;
    private _table;
    private _tbody;
    private _thead;
    constructor(options: TTableOptions);
    /**
     * Clears out all rows and headers from table
     */
    clear(): TableGrid;
    /**
     * Saves data into TableGrid
     * @param data
     */
    data(rows: TTableRow[]): TableGrid;
    /**
     * Removes this table from the DOM
     */
    destroy(): TableGrid;
    /**
     * Saves data into TableGrid
     * @param header
     */
    header(header: TTableHeaderCell[]): TableGrid;
    /**
     * Draws the table
     */
    draw(): TableGrid;
    /**
     * Actions to perform on row click
     * @param e
     */
    rowClickHandler(e: MouseEvent): void;
    /**
     * Provides the sorting logic for the table columns
     * @param e
     */
    sortHandler(e: MouseEvent): void;
    /**
     * Serialise the data
     */
    toString(): string;
    /**
     * Creates the basic table structure
     */
    private _createTable;
    /**
     * Draws the table header
     */
    private _drawHeader;
    /**
     * Draws the navigation footer
     */
    private _drawNavigation;
    /**
     * Draws the table rows
     */
    private _drawRows;
    /**
     * Updates table rows on scroll
     * @param n relative number to scroll by
     */
    private _scrollRows;
}
