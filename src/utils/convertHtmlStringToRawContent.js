function convertHtmlStringToRawContent(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const rawContent = doc.body.textContent || '';

  return rawContent;
}

export default convertHtmlStringToRawContent;
