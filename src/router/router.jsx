import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PDFUpload from "../pages/pdf_upload/pdfUpload";
import QuerySearch from "../pages/search/querySearch";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "pdf_upload",
        element: <PDFUpload />,
      },
      {
        path: "query",
        element: <QuerySearch />,
      },
    ],
  },
]);

export default router;
