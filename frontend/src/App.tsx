import { useState } from "react";

function App() {
  // For storing the response from your backend
  const [responseData, setResponseData] = useState(null);

  // Optional: If you want to call the backend immediately on page load

  // Function to call your backend
  const callBackend = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/run_flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Hello from Vite React!" }),
        mode: "cors",
      });

      console.log(res);

      const data = await res.json();

      console.log("hello");

      console.log(data);

      setResponseData(data);
    } catch (err) {
      console.error("Error calling backend:", err);
    }
  };

  return (
    <div>
      <h1>Vite + React</h1>
      <button onClick={callBackend}>Call Backend</button>

      <div style={{ marginTop: "20px" }}>
        <strong>Backend Response:</strong>
        <pre>
          {responseData ? JSON.stringify(responseData, null, 2) : "No data yet"}
        </pre>
      </div>
    </div>
  );
}

export default App;
