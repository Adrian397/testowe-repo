import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import pdfFile from "./assets/sample.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function App() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasFinishedPresentation, setHasFinishedPresentation] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const isPresentationFullyWatched = () => {
    return hasFinishedPresentation || pageNumber === numPages;
  };

  const handleNextPage = () => {
    setTransitionClass("slide-left");
    if (pageNumber + 1 === numPages) {
      setHasFinishedPresentation(true);
    }
    setTimeout(() => {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      setTransitionClass("");
    }, 300);
  };

  const handlePrevPage = () => {
    setTransitionClass("slide-right");
    setTimeout(() => {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
      setTransitionClass("");
    }, 300);
  };
  const handleButtonClick = () => {
    if (isPresentationFullyWatched()) {
      alert("Ukonczono lekcje");
    } else {
      alert("Przejrzyj całą prezentację, aby ukończyć lekcję");
    }
  };

  return (
    <div className="wrapper">
      <div className={`page-wrapper ${transitionClass}`}>
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      <div className="buttons-wrapper">
        <div>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button onClick={handlePrevPage} disabled={pageNumber <= 1}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={pageNumber >= (numPages ? numPages : 0)}
          >
            Next
          </button>
        </div>
        <button
          className={`btn ${
            isPresentationFullyWatched() ? "finished" : "not-finished"
          }`}
          onClick={handleButtonClick}
        >
          Ukończ lekcję
        </button>
      </div>
    </div>
  );
}
