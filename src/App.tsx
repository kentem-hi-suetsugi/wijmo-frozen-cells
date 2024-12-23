import "@grapecity/wijmo.styles/wijmo.css";
import { FlexGrid as WijmoReactFlexGrid } from "@grapecity/wijmo.react.grid";
import {
  FlexGrid as WijmoFlexGrid,
  HeadersVisibility,
  Column,
  GridPanel,
} from "@grapecity/wijmo.grid";
import { CollectionView } from "@grapecity/wijmo";
import "./app.css";
import { data } from "./data";
import { useEffect, useState } from "react";

export type Data = {
  checker: boolean;
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  num6: number;
  num7: number;
  num8: number;
  num9: number;
  num0: number;
};
function App() {
  const [_data, setData] = useState<Data[]>(
    data.map((row) => {
      return { ...row };
    })
  );

  const [view, setView] = useState<CollectionView<Data> | null>(null);
  useEffect(() => {
    console.log(_data);
    setView(
      new CollectionView(_data, {
        calculatedFields: {
          ["sum"]: (data: Data) => data.num1 + data.num2,
        },
      })
    );
  }, [_data]);

  const columns = [
    {
      header: "チェック",
      binding: "checker",
      align: "right",
    },
    { binding: "num1", header: "数値1" },
    { binding: "num2", header: "数値2" },
    { binding: "sum", header: "合計", isReadOnly: true },
    { binding: "num3", header: "数値3" },
    { binding: "num4", header: "数値4" },
    { binding: "num5", header: "数値5" },
    { binding: "num6", header: "数値6" },
    { binding: "num7", header: "数値7" },
    { binding: "num8", header: "数値8" },
    { binding: "num9", header: "数値9" },
    { binding: "num0", header: "数値0" },
  ];

  const initialized = (grid: WijmoFlexGrid) => {
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
      grid.columns.push(new Column(columns[columnIndex]));
    }
    grid.formatItem.addHandler((_, e) => {
      itemFormatter(e.panel, e.row, e.col, e.cell);
    });
  };

  const itemFormatter = (
    panel: GridPanel,
    r: number,
    c: number,
    cell: HTMLElement
  ) => {
    if (
      panel.columns[c].binding === "checker" &&
      !cell.classList.contains("wj-header")
    ) {
      const checked = panel.getCellData(r, c, false);
      cell.innerHTML = `
      <label>
        <input type="checkbox" id="checker-${r}" ${checked && "checked"}>
        ${checked ? "hogehoge" : "fugafuga"}
      </label>`;
      const checkerCell = document.getElementById(`checker-${r}`);
      checkerCell?.addEventListener("change", () => {
        setData((prev) => {
          return prev.map((row, i) =>
            i === r ? { ...row, checker: !row.checker } : row
          );
        });
      });
    }
  };
  return (
    <>
      <button
        onClick={() => {
          console.log(_data);
        }}
      >
        console.log
      </button>
      <WijmoReactFlexGrid
        allowSorting="None"
        allowDragging="None"
        selectionMode="MultiRange"
        itemsSource={view}
        initialized={initialized}
        refreshOnEdit={false}
        headersVisibility={HeadersVisibility.Column}
        autoGenerateColumns={false}
        frozenColumns={1}
      />
    </>
  );
}

export default App;
