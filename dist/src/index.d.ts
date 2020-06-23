export declare type TTableCell = {
    label?: string;
    value: string | number | Date;
};
export declare type TTableHeaderCell = {
    label?: string;
    value: string | number | Date;
    sort: boolean;
};
export declare type TTable = {
    headers: TTableHeaderCell[];
    rows: TTableCell[][];
};
export declare type TTableOptions = {
    container: HTMLElement;
    data: TTable[];
    locale?: string;
    rows?: number;
};
export declare class TableGrid {
    container: HTMLElement;
    locale: string;
    rows: number;
    private _cursor;
    private _data;
    private _id;
    private _table;
    private _tbody;
    private _thead;
    constructor(options: TTableOptions);
    /**
     * Creates the basic table structure
     */
    createTable(): TableGrid;
    /**
     * Saves data into Table
     * @param data
     */
    data(data: any): TableGrid;
    /**
     * Removes this table from the DOM
     */
    destroy(): TableGrid;
    /**
     * Draws the table
     */
    draw(): TableGrid;
    /**
     * Draws the table header
     */
    drawHeader(): TableGrid;
    /**
     * Draws the navigation footer
     */
    drawNavigation(): TableGrid;
    /**
     * Draws the table rows
     */
    drawRows(): TableGrid;
    /**
     * Updates table rows on scroll
     * @param n relative number to scroll by
     */
    scrollRows(n: number): TableGrid;
    /**
     * Provides the sorting logic for the table columns
     * @param e
     */
    sortHandler(e: MouseEvent): void;
    /**
     * Serialise the data
     */
    toString(): string;
}
