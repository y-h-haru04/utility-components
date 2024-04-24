import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import style from "./index.module.css";

type ColumnProps<T extends object> = {
  index: number;
  row: T;
};

type TableHeaderColProps<T extends object> = {
  id: keyof T;
  label: string;
  className?: string;
  colClassName?: string;
  template?: React.FC<ColumnProps<T>>;
};

type Props<T extends object> = {
  rows: T[];
  headCols: TableHeaderColProps<T>[];
  height?: number;
  stickyColumns?: number;
  topOffsetRef?: MutableRefObject<HTMLElement | null>;
  bottomOffsetRef?: MutableRefObject<HTMLElement | null>;
  onClickRow?: (event: React.MouseEvent<unknown>, rowInfo: T) => void;
};
const Table = <T extends object>({
  headCols,
  rows,
  topOffsetRef,
  bottomOffsetRef,
  height,
  stickyColumns = 0,
}: Props<T>) => {
  const rowRef = useRef<HTMLTableRowElement | null>(null);
  const delayRef = useRef<number | undefined>(undefined);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0);
  const [rowWidthList, setRowWidthList] = useState<number[]>([]);

  const calculateHeight = useCallback(() => {
    if (height || !topOffsetRef?.current || !bottomOffsetRef?.current) {
      return;
    }
    console.log("### callc");
    const rect: DOMRect = topOffsetRef.current.getBoundingClientRect();
    const siblingRect: DOMRect =
      bottomOffsetRef.current.getBoundingClientRect();
    const topOffsetY = rect.y || 0;
    const bottomOffsetY = siblingRect.y || 0;
    setCalculatedHeight(window.innerHeight - topOffsetY - bottomOffsetY);
  }, [height]);

  const calculateWidthList = useCallback(() => {
    const rowElement: HTMLTableRowElement | null = rowRef?.current;
    if (rowElement?.children) {
      const widthList = Array.prototype.map.call(
        rowElement.children,
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
      calculateHeight();
      calculateWidthList();
    }, 500);
  }, [calculateHeight, calculateWidthList]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className={style.tableWrrapper}
      style={{ height: height ? height : calculatedHeight }}
    >
      <table className={style.table}>
        {/* setHeight? */}
        <thead>
          <tr ref={rowRef}>
            {headCols.map((col: TableHeaderColProps<T>, index: number) => (
              <th
                key={col.id as string}
                style={
                  index < stickyColumns
                    ? {
                        left: `${
                          rowWidthList.slice(0, index).reduce((acc, cur) => {
                            return acc + cur;
                          }, 0) || 0
                        }px`,
                      }
                    : undefined
                }
                // onClick={(ev) => onClick}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr
                key={index}
                onClick={ev => {}}
                // onClick={(ev) => onClickRow?.(row, index)}
              >
                {headCols.map((col: TableHeaderColProps<T>, i: number) => {
                  const value = row[col.id as string];
                  const className =
                    typeof col?.colClassName === "function"
                      ? col.colClassName({ row, index })
                      : col.colClassName;
                  // const className = "sample";
                  return (
                    <td
                      key={col.id as string}
                      className={className}
                      style={
                        i < stickyColumns
                          ? {
                              position: "sticky",
                              left: `${
                                // rowWidthLeft.slice(0, i).reduce((acc, cur) => {
                                rowWidthList.slice(0, i).reduce((acc, cur) => {
                                  return acc + cur;
                                }, 0) || 0
                              }px`,
                              zIndex: headCols.length - 1,
                            }
                          : undefined
                      }
                    >
                      {(() => {
                        if (col.template) {
                          return col.template({ row, index });
                        }
                        if (
                          typeof value === "string" ||
                          typeof value === "number"
                        ) {
                          return value;
                        }
                        // return <></>;
                        return value;
                      })()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
