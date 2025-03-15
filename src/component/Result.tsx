import { useAtom } from "jotai";
import { elementsAtom, nodesAtom } from "../atoms";
import { useEffect, useState } from "react";

const Result: React.FC = () => {
  const [globalStiffnessMatrix, setGlobalStiffnessMatrix] = useState<
    number[][] | null
  >([]);
  const [nodes] = useAtom(nodesAtom);
  const [elements] = useAtom(elementsAtom);

  useEffect(() => {
    setGlobalStiffnessMatrix(null);
  }, [nodes, elements]);

  const generateGlobalStiffnessMatrix = () => {
    const global_k = Array.from({ length: nodes.length * 2 }, () =>
      Array(nodes.length * 2).fill(0)
    );

    elements.forEach((element) => {
      const node1 = nodes.find((node) => node.id === element.node1);
      const node2 = nodes.find((node) => node.id === element.node2);

      if (node1 && node2) {
        const L = ((node2.x - node1.x) ** 2 + (node2.y - node1.y) ** 2) ** 0.5;
        const lamba_x = (node2.x - node1.x) / L;
        const lamba_y = (node2.y - node1.y) / L;

        const mapped = [
          (node1.id - 1) * 2,
          (node1.id - 1) * 2 + 1,
          (node2.id - 1) * 2,
          (node2.id - 1) * 2 + 1,
        ];

        const k = [
          [
            lamba_x ** 2 / L,
            (lamba_x * lamba_y) / L,
            -(lamba_x ** 2) / L,
            (-lamba_x * lamba_y) / L,
          ],
          [
            (lamba_x * lamba_y) / L,
            lamba_y ** 2 / L,
            -(lamba_x * lamba_y) / L,
            -(lamba_y ** 2) / L,
          ],
          [
            -(lamba_x ** 2) / L,
            (-lamba_x * lamba_y) / L,
            lamba_x ** 2 / L,
            (lamba_x * lamba_y) / L,
          ],
          [
            (-lamba_x * lamba_y) / L,
            -(lamba_y ** 2) / L,
            (lamba_x * lamba_y) / L,
            lamba_y ** 2 / L,
          ],
        ];

        for (let i = 0; i < k.length; i++) {
          for (let j = 0; j < k[i].length; j++) {
            global_k[mapped[i]][mapped[j]] += k[i][j];
          }
        }
        setGlobalStiffnessMatrix(global_k as any);
      }
    });
  };

  return (
    <div>
      <h2>Result</h2>
      <button
        className="button-primary"
        onClick={generateGlobalStiffnessMatrix}
      >
        Generate Stiffness Matrix
      </button>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              {globalStiffnessMatrix?.map((row, i) => (
                <tr key={i}>
                  {row.map((col, j) => (
                    <td key={j}>{col.toFixed(3)}</td>
                  ))}
                </tr>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Result;
