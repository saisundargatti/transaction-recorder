import "./App.css";
import Delete from "./components/delete";
import Get from "./components/get";
import Post from "./components/post";
import Update from "./components/update";
import { useState } from "react";

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleGet = () => {
    setActiveComponent("get");
  };

  const handlePost = () => {
    setActiveComponent("post");
  };

  const handleUpdate = () => {
    setActiveComponent("update");
  };

  const handleRemove = () => {
    setActiveComponent("remove");
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Transaction Recorder</h2>
        <button onClick={handleGet}>Get</button>
        <button onClick={handlePost}>Post</button>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleRemove}>Delete</button>
      </div>
      <div className="main-content">
        {activeComponent === "get" && <Get />}
        {activeComponent === "post" && <Post />}
        {activeComponent === "update" && <Update />}
        {activeComponent === "remove" && <Delete />}
      </div>
    </div>
  );
}

export default App;
