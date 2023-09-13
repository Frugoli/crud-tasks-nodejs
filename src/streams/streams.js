import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('../docs/tasks.csv', import.meta.url);
const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
});

async function ReadAndInsertCSV() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

      await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        })
      })

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

}

ReadAndInsertCSV()