import "style/src/index.css";
import styles from "./app.module.css";
import Table from "./components/Table";
import { useState } from "react";

type Row = {
  label1: string;
  label2: string;
  label3: string;
  label4: string;
  label5: string;
  label6: string;
  label7: string;
  label8: string;
  label9: string;
  label10: string;
};

type RowTemplate = {
  row: Row;
  index: number;
};

const App = () => {
  const [stickyColumns, setStickyColumns] = useState<number>(1);

  const onChangeStickyColumns = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    const intVal = parseInt(value, 10);
    if (!isNaN(intVal) && intVal <= 10) {
      setStickyColumns(intVal);
    }
  };

  const onClickRow = (row: Row, ev: React.MouseEvent<unknown>) => {
    ev.stopPropagation();
    console.log("### row clicked.", row);
  };

  const onClickRowButton = (
    row: Row,
    ev: React.MouseEvent<HTMLButtonElement>,
  ) => {
    ev.stopPropagation();
    console.log("### button clicked.", row);
  };

  const headCols = [
    {
      id: "label1",
      label: "label1",
    },
    {
      id: "label2",
      label: "label2",
    },
    {
      id: "label3",
      label: "label3",
    },
    {
      id: "label4",
      label: "label4",
    },
    {
      id: "label5",
      label: "label5",
    },
    {
      id: "label6",
      label: "label6",
    },
    {
      id: "label7",
      label: "label7",
    },
    {
      id: "label8",
      label: "label8",
    },
    {
      id: "label9",
      label: "label9",
    },
    {
      id: "label10",
      label: "label10",
      template: ({ row }: RowTemplate) => (
        <div>
          <span>{row.label10}</span>
          <button onClick={ev => onClickRowButton(row, ev)}>
            Click This!!
          </button>
        </div>
      ),
    },
  ] as const;

  const rows = Array(100)
    .fill(null)
    .map((_, index) => {
      return {
        label1: `label1 ${index}`,
        label2: `label2 ${index}`,
        label3: `label3 ${index}`,
        label4: `label4 ${index}`,
        label5: `label5 ${index}`,
        label6: `label6 ${index}`,
        label7: `label7 ${index}`,
        label8: `label8 ${index}`,
        label9: `label9 ${index}`,
        label10: `label10 ${index}`,
      };
    });

  return (
    <main>
      <header className={styles.header}>ReactComponents</header>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <label htmlFor="col-input" className={styles.formGroup}>
            <span>Column Number</span>
            <input id="col-input" onChange={onChangeStickyColumns} />
          </label>
        </div>
        <Table<Row>
          // height={700} // 高さを固定で指定してもいい
          stickyColumns={stickyColumns}
          headCols={headCols}
          rows={rows}
          onClickRow={onClickRow}
        />
      </div>
    </main>
  );
};

export default App;
