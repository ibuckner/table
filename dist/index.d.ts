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
    private _data;
    private _id;
    private _table;
    private _tbody;
    private _thead;
    constructor(options: TTableOptions);
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
    drawHeader(): TableGrid;
    drawRows(): TableGrid;
    drawScroll(): TableGrid;
    sortHandler(e: MouseEvent): void;
    /**
     * Serialise the data
     */
    toString(): string;
}
