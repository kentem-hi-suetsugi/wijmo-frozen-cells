import "@grapecity/wijmo.styles/wijmo.css";
// import '@mescius/wijmo.touch';
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
import { useEffect, useRef, useState } from "react";
// import useEvent from "react-use-event-hook";

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
  const [data2, setData2] = useState<Data[]>(
    _data.map((row) => {
      return { ...row };
    })
  );

  const [view, setView] = useState<CollectionView<Data> | null>(null);
  const flex = useRef<WijmoFlexGrid | null>(null);

  useEffect(() => {
    console.log(_data);

    setView(
      view // update view data
        ? (view) => {
            if (view) {
              view.sourceCollection = _data;
            }
            return view;
          }
        : new CollectionView(_data, {
            // create a new CollectionView
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

  function updateChecker(e) {
    const ht = flex.current?.hitTest(e);

    if (ht) {
      const row = ht.getRow();
      const col = ht.getColumn();
      if (col && col.binding === "checker" && row.dataIndex > -1) {
        e.preventDefault();
        const item = ht.getRow().dataItem;

        item.checker = !item.checker;
        flex.current?.refreshCells(true);
        flex.current?.select(ht.range);

        // No need to update the state because the data is already updated
        // however, if you want to update the state, you can do it like this

        setData((prev) => {
          prev.forEach((row, i) => {
            if (i === ht.row) {
              row.checker = item.checker;
            }
          });
          return prev;
        });
        setData2(_data.map((row) => ({ ...row })));
      }
    }
  }

  const initialized = (grid: WijmoFlexGrid) => {
    flex.current = grid;
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
      grid.columns.push(new Column(columns[columnIndex]));
    }
    grid.formatItem.addHandler((_, e) => {
      itemFormatter(e.panel, e.row, e.col, e.cell);
    });

    grid.hostElement.addEventListener("click", updateChecker);
    grid.hostElement.addEventListener("touchstart", updateChecker); // for i-pad
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
      const item = panel.rows[r].dataItem;
      const checked = item.checker;
      cell.innerHTML = `
        <label>
        <input type="checkbox" id="checker-${r}" ${checked && "checked"}>
        ${checked ? "hogehoge" : "fugafuga"}
        </label>`;
    } else if (
      panel.columns[c].binding === "checker" &&
      cell.classList.contains("wj-header")
    ) {
      const checked = _data.every((row) => row.checker);
      cell.innerHTML = `
      <label>
      <input type="checkbox" id="checker-header" ${checked && "checked"}>
      ${checked ? "headerHoge" : "headerFuga"}
      </label>`;
    }
  };
  return (
    <>
      <div>
        チェックされた行数（data2参照）：
        {data2.filter((row) => row.checker).length}
      </div>
      <div>
        チェックされた行数（_data参照）：
        {_data.filter((row) => row.checker).length}
      </div>
      <button
        onClick={() => {
          console.log(_data);
          console.log(
            `チェックされた行数：${_data.filter((row) => row.checker).length}`
          );
        }}
      >
        console.log
      </button>
      <button
        onClick={() => {
          setData2(_data);
        }}
      >
        再レンダリング
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
        cellEditEnded={() => setData2(_data.map((row) => ({ ...row })))}
      />
    </>
  );
}

export default App;
