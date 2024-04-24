import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import style from "./index.module.css";

type ColProps<T extends object> = {
  index: number;
  row: T;
};

type HeadColProps<T extends object> = {
  id: keyof T;
  label: string;
  className?: string;
  template?: React.FC<ColProps<T>>;
};

type TableProps<T extends object> = {
  rows: T[];
  headCols: readonly HeadColProps<T>[];
  height?: number;
  stickyColumns?: number;
  onClickRow?: (rowInfo: T, event: React.MouseEvent<unknown>) => void;
};

type TableHeadProps<T extends object> = Pick<
  TableProps<T>,
  "headCols" | "stickyColumns"
> & {
  rowWidthList: number[];
};

type TableBodyProps<T extends object> = Pick<
  TableProps<T>,
  "rows" | "headCols" | "stickyColumns" | "onClickRow"
> & {
  rowWidthList: number[];
};

const resolveColStyle =
  <T extends object>(
    rowWidthList: number[],
    headCols: readonly HeadColProps<T>[],
    stickyColumns?: number,
    isBodyCol = false,
  ) =>
  (colIndex: number): React.CSSProperties => {
    const isSticky = colIndex < (stickyColumns || 0);
    return {
      position: isSticky ? "sticky" : undefined,
      backgroundColor: isSticky ? "#eeaaaa" : undefined, // NOTE: For debug
      left: isSticky
        ? `${
            rowWidthList.slice(0, colIndex).reduce((acc, cur) => {
              return acc + cur;
            }, 0) || 0
          }px`
        : undefined,
      zIndex: headCols.length - colIndex - (isBodyCol ? 1 : 0),
    };
  };

const TableHead = <T extends object>({
  headCols,
  stickyColumns,
  rowWidthList,
}: TableHeadProps<T>) => {
  const colStyleResolver = useMemo(() => {
    return resolveColStyle(rowWidthList, headCols, stickyColumns);
  }, [rowWidthList, headCols, stickyColumns]);

  return (
    <thead>
      <tr>
        {headCols.map((col: HeadColProps<T>, index: number) => {
          return (
            <th key={col.id as string} style={colStyleResolver(index)}>
              {col.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const TableBody = <T extends object>({
  rows,
  headCols,
  stickyColumns,
  rowWidthList,
  onClickRow,
}: TableBodyProps<T>) => {
  const colStyleResolver = useMemo(() => {
    return resolveColStyle(rowWidthList, headCols, stickyColumns, true);
  }, [rowWidthList, headCols, stickyColumns]);

  return (
    <tbody>
      {rows.map((row, index) => {
        return (
          <tr key={index} onClick={ev => onClickRow?.(row, ev)}>
            {headCols.map((col: HeadColProps<T>, i: number) => {
              return (
                <td key={col.id as string} style={colStyleResolver(i)}>
                  {(() => {
                    if (col.template) {
                      return col.template({ row, index });
                    }
                    return <>{row[col.id]}</>;
                  })()}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

const Table = <T extends object>({
  height,
  rows,
  headCols,
  stickyColumns = 0,
  onClickRow,
}: TableProps<T>) => {
  const rowRef = useRef<HTMLTableElement | null>(null);
  const delayRef = useRef<number | undefined>(undefined);
  const [rowWidthList, setRowWidthList] = useState<number[]>([]);

  // Calculate each width of table columns.
  const calculateWidthList = useCallback(() => {
    const theadElement: HTMLTableElement | null = rowRef?.current;
    const thList = theadElement?.querySelectorAll("th");
    if (thList) {
      const widthList = Array.prototype.map.call(
        thList,
        (html: HTMLElement) => {
          return html.clientWidth;
        },
      );
      setRowWidthList(widthList as number[]);
    }
  }, []);

  // Delay to reduce the number of recalculations during resizing.
  const onResize = useCallback(() => {
    clearTimeout(delayRef.current);
    delayRef.current = setTimeout(() => {
      calculateWidthList();
    }, 500);
  }, [calculateWidthList]);

  // Add resize event listener.
  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={style.tableWrrapper} style={{ height: height }}>
      <table className={style.table} ref={rowRef}>
        <TableHead
          headCols={headCols}
          rowWidthList={rowWidthList}
          stickyColumns={stickyColumns}
        />
        <TableBody
          rows={rows}
          headCols={headCols}
          rowWidthList={rowWidthList}
          stickyColumns={stickyColumns}
          onClickRow={onClickRow}
        />
      </table>
    </div>
  );
};
export default Table;
