const LAST_PDF_KEY = "last-pdf";
const LAST_SCROLL_KEY = "pdf-scroll";

export function saveLastPdf(id: string) {
  localStorage.setItem(LAST_PDF_KEY, id);
}

export function getLastPdf() {
  return localStorage.getItem(LAST_PDF_KEY);
}

export function saveScrollPosition(id: string, position: number) {
  const data = JSON.parse(localStorage.getItem(LAST_SCROLL_KEY) || "{}");

  data[id] = position;

  localStorage.setItem(LAST_SCROLL_KEY, JSON.stringify(data));
}

export function getScrollPosition(id: string) {
  const data = JSON.parse(localStorage.getItem(LAST_SCROLL_KEY) || "{}");

  return data[id] || 0;
}
