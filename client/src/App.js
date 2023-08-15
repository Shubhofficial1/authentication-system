import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Layout>
              <h1>Hello</h1>
            </Layout>
          </>
        }
      />
    </Routes>
  );
}

export default App;
