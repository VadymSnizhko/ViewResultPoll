document.getElementById("fileInput").addEventListener("change", async function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const zip = await JSZip().loadAsync(file);
  
  const sheetXml = await zip.file("xl/worksheets/sheet1.xml").async("text");
  const sharedStringsXml = zip.file("xl/sharedStrings.xml") 
      ? await zip.file("xl/sharedStrings.xml").async("text") 
      : null;

  displayTable(sheetXml, sharedStringsXml);
});

function displayTable(sheetXml, sharedStringsXml) {
  const parser = new DOMParser();
  const sheetDoc = parser.parseFromString(sheetXml, "application/xml");
  const sharedStrings = sharedStringsXml ? parseSharedStrings(sharedStringsXml) : [];

  const rows = sheetDoc.querySelectorAll("sheetData row");
  const table = document.getElementById("dataTable");
  table.innerHTML = ""; 

  let totalSum = 0; // Для підрахунку загальної суми

  rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      let rowData = [];

      row.querySelectorAll("c").forEach(cell => {
          const value = cell.querySelector("v")?.textContent || "";
          const type = cell.getAttribute("t");

          const textValue = type === "s" ? sharedStrings[value] : value;
          rowData.push(textValue);
          
          const td = document.createElement(index === 0 ? "th" : "td");
          td.textContent = textValue;
          tr.appendChild(td);
      });

      // Перевіряємо, чи це "Фіскальний чек", і додаємо суму
      if (index > 0 && rowData[5] === "Фіскальний чек") {
          totalSum += parseFloat(rowData[7]?.replace(",", ".") || 0);
      }

      table.appendChild(tr);
  });

  // Відображаємо загальну суму
  document.getElementById("totalSum").textContent = `Загальна сума: ${totalSum.toFixed(2)} грн`;
  document.getElementById("tax").textContent = `Податок 5 %: ${(totalSum / 100 * 5).toFixed(2)} грн`;
}

function parseSharedStrings(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return [...doc.querySelectorAll("si t")].map(el => el.textContent);
}
