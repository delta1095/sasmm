import { useState } from "react";
import { useAtom } from "jotai";
import { nodesAtom } from "../atoms";
import { Node } from "../atoms";

export const Nodes = () => {
  const [nodes, setNodes] = useAtom(nodesAtom);

  const [newNode, setNewNode] = useState<Node>({
    id: 0,
    x: 0,
    y: 0,
    z: 0,
    support: "free",
  });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [newCoordinates, setNewCoordinates] = useState({
    x: 0,
    y: 0,
    z: 0,
    support: "free",
  });

  const handleAddNode = () => {
    const newNodeObject = {
      id: nodes.length + 1, // Ensure unique id
      x: newNode.x,
      y: newNode.y,
      z: newNode.z,
      support: newNode.support,
    };
    setNodes([...nodes, newNodeObject]); // Add new node to the array
    setNewNode({ id: 0, x: 0, y: 0, z: 0, support: "free" }); // Reset the form
  };

  const handleUpdateNode = () => {
    const updatedNodes = nodes.map((node) =>
      node.id === selectedNodeId
        ? { ...node, ...newCoordinates } // Update the selected node's coordinates
        : node
    );
    setNodes(updatedNodes as any); // Update the nodes array
    setNewCoordinates({ x: 0, y: 0, z: 0, support: "free" }); // Reset the update form
    setSelectedNodeId(null); // Deselect node
  };

  const handleDeleteLastNode = () => {
    const updatedNodes = nodes.slice(0, -1); // Remove the last node
    setNodes(updatedNodes); // Update the nodes array
  };

  return (
    <div>
      {selectedNodeId ? (
        <div>
          <h2>Update Node {selectedNodeId}</h2>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-groups">
              <div className="input-group">
                <label htmlFor="length">x (m)</label>
                <input
                  type="number"
                  placeholder="New x"
                  value={newCoordinates.x}
                  max={800}
                  onChange={(e) =>
                    setNewCoordinates({
                      ...newCoordinates,
                      x: +e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label htmlFor="length">y (m)</label>
                <input
                  type="number"
                  placeholder="New y"
                  max={800}
                  value={newCoordinates.y}
                  onChange={(e) =>
                    setNewCoordinates({ ...newCoordinates, y: +e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label htmlFor="length">z (m)</label>
                <input
                  disabled
                  type="number"
                  placeholder="New z"
                  value={newCoordinates.z}
                  onChange={(e) =>
                    setNewCoordinates({ ...newCoordinates, z: +e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label htmlFor="length">Support type</label>
                <select
                  value={newCoordinates.support}
                  onChange={(e) =>
                    setNewCoordinates({
                      ...newCoordinates,
                      support: e.target.value as
                        | "fixed"
                        | "free"
                        | "pinned"
                        | "v_roller"
                        | "h_roller",
                    })
                  }
                >
                  <option value="" disabled></option>
                  <option value="free">Free</option>
                  <option value="fixed">Fixed</option>
                  <option value="pinned">Pinned</option>
                  <option value="v_roller">V Roller</option>
                  <option value="h_roller">H Roller</option>
                </select>
              </div>
            </div>
            <button className="button-primary" onClick={handleUpdateNode}>
              Update Node
            </button>
            <button
              className="button-red"
              onClick={() => setSelectedNodeId(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <>
          <h2>Add a New Node</h2>

          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-groups">
              <div className="input-group">
                <label htmlFor="length">x (m)</label>
                <input
                  type="number"
                  placeholder="x"
                  value={newNode.x}
                  max={800}
                  onChange={(e) =>
                    setNewNode({ ...newNode, x: +e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label htmlFor="length">y (m)</label>
                <input
                  type="number"
                  placeholder="y"
                  value={newNode.y}
                  max={800}
                  onChange={(e) =>
                    setNewNode({ ...newNode, y: +e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label htmlFor="length">z (m)</label>
                <input
                  disabled
                  type="number"
                  placeholder="z"
                  value={newNode.z}
                  onChange={(e) =>
                    setNewNode({ ...newNode, z: +e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label htmlFor="length">Support type</label>
                <select
                  value={newNode.support}
                  onChange={(e) =>
                    setNewNode({
                      ...newNode,
                      support: e.target.value as
                        | "fixed"
                        | "free"
                        | "pinned"
                        | "v_roller"
                        | "h_roller",
                    })
                  }
                >
                  <option value="" disabled></option>
                  <option value="free">Free</option>
                  <option value="fixed">Fixed</option>
                  <option value="pinned">Pinned</option>
                  <option value="v_roller">V Roller</option>
                  <option value="h_roller">H Roller</option>
                </select>
              </div>
            </div>
            <button className="button-primary" onClick={handleAddNode}>
              Add Node
            </button>
          </form>
        </>
      )}
      {nodes.length ? (
        <>
          <div className="table-container">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>X</th>
                  <th>Y</th>
                  <th>Z</th>
                  <th>Support type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node, index) => (
                  <tr key={node.id}>
                    <td>{node.id}</td>
                    <td>{node.x}</td>
                    <td>{node.y}</td>
                    <td>{node.z}</td>
                    <td>{node.support}</td>
                    <td>
                      <button
                        className="button-secondary"
                        onClick={() => {
                          setSelectedNodeId(node.id as any);
                          setNewCoordinates({
                            x: node.x, // Set the current x value
                            y: node.y, // Set the current y value
                            z: node.z, // Set the current z value
                            support: node.support, // Set the current support value}}
                          });
                        }}
                      >
                        Edit
                      </button>

                      {index === nodes.length - 1 && (
                        <button
                          className="button-red"
                          onClick={handleDeleteLastNode}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>{" "}
        </>
      ) : null}
    </div>
  );
};
