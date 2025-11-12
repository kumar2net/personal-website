import { Routes, Route } from "react-router-dom";

// ... other imports
import Home from "./pages/Home"; // Assuming you have a Home component
import About from "./pages/About"; // Assuming you have an About component
import Projects from "./pages/Projects"; // Assuming you have a Projects component
import Project from "./pages/Project"; // Assuming you have a Project component for single projects

function App() {
  return (
    <Routes>
      {/* ... other routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId" element={<Project />} />
      {/* ... other routes */}
    </Routes>
  );
}

export default App;
