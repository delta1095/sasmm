import { useState } from "react";
import "./App.css";
import { Nodes } from "./tabs/Nodes";
import { Elements } from "./tabs/Elements";
import GraphComponent from "./component/GraphComponent";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: "Nodes", content: <Nodes /> },
    { name: "Elements", content: <Elements /> },
    { name: "Loads", content: "Coming Soon!" },
  ];

  return (
    <div className="App">
      <h1>Structural Analysis using Stiffness Matrix Method</h1>
      <span>Developed by Deepesh Chhetri</span>
      <hr />
      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={activeTab === index ? "tab active" : "tab"}
              onClick={() => setActiveTab(index)}
            >
              <strong>{tab.name}</strong>
            </button>
          ))}
        </div>
        <div className="tabs-content">{tabs[activeTab].content}</div>
      </div>
      <GraphComponent />
    </div>
  );
};

export default Tabs;
