document
  .getElementById('fileInput')
  .addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Будь ласка, оберіть CSV файл');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const rows = text
        .trim()
        .split('\n')
        .map(row => row.split(','));

      const table = document.createElement('table');

      table.border = '1';

      const uniqueSecondColumn = new Set();

      const output = document.getElementById('output');
      output.innerHTML = ''; // очистка перед виводом нової таблиці
      output.appendChild(table);

      let arrayGoest = [];
      let sortArray;

      //console.log(rows);
      rows.forEach((row, index) => {
        //формуємо масив лише імен та кількість
        if (index >= 10) {
          //  console.log(row[1]);
          arrayGoest.push([row[1], parseInt(row[7])]);
          sortArray = arrayGoest.toSorted();
        }
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
          const el =
            index === 0
              ? document.createElement('th')
              : document.createElement('td');
          el.textContent = cell;
          tr.appendChild(el);
        });
        table.appendChild(tr);
      });
      console.log(sortArray);
      const seen = new Set(); // для унікальних імен
      let total = 0;

      for (const [name, count] of sortArray) {
        if (name === 'Гость') {
          total += count; // "Гость" рахуємо завжди
        } else if (!seen.has(name)) {
          seen.add(name); // додаємо ім’я в Set
          total += count;
        }
      }

      console.log('Загальна сума:', total);
      const resultSum = document.getElementById('totalSum');
      //console.log(resultSum);

      resultSum.insertAdjacentHTML('beforeend', ' ' + total);
    };

    reader.readAsText(file);
  });
