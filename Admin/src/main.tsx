import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./app/redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
