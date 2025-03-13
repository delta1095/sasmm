import { useState } from "react";
import { useAtom } from "jotai";
import { nodesAtom, elementsAtom } from "../atoms";

export const Elements = () => {
  const [nodes] = useAtom(nodesAtom);
  const [elements, setElements] = useAtom(elementsAtom);

  const [newElement, setNewElement] = useState({ node1: null, node2: null });

  const handleAddElement = () => {
    if (newElement.node1 !== null && newElement.node2 !== null) {
      const newElementObject = {
        id: elements.length + 1, // Ensure unique id
        node1: newElement.node1,
        node2: newElement.node2,
      };
      setElements([...elements, newElementObject]); // Add new element to the array
      setNewElement({ node1: null, node2: null }); // Reset the form
    }
  };

  const handleDeleteElement = (elementId: any) => {
    const updatedElements = elements.filter(
      (element) => element.id !== elementId
    ); // Remove selected element
    setElements(updatedElements); // Update the elements array
  };

  return (
    <div>
      <h2>Add a New Element</h2>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-groups">
          <div className="input-group">
            <label htmlFor="node1">Start Node</label>
            <select
              value={newElement.node1 || ""}
              onChange={(e) =>
                setNewElement({ ...newElement, node1: +e.target.value as any })
              }
            >
              <option value="" disabled></option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  Node: {node.id} (x: {node.x}, y: {node.y}, z: {node.z})
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="node2">End Node</label>
            <select
              value={newElement.node2 || ""}
              onChange={(e) =>
                setNewElement({ ...newElement, node2: +e.target.value as any })
              }
            >
              <option value="" disabled></option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  Node: {node.id} (x: {node.x}, y: {node.y}, z: {node.z})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="button-primary" onClick={handleAddElement}>
          Add Element
        </button>
      </form>

      {elements.length ? (
        <>
          <div className="table-container">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Element ID</th>
                  <th>Node 1</th>
                  <th>Node 2</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {elements.map((element) => (
                  <tr key={element.id}>
                    <td>{element.id}</td>
                    <td>{element.node1}</td>
                    <td>{element.node2}</td>
                    <td>
                      <button
                        className="button-red"
                        onClick={() => handleDeleteElement(element.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
};
