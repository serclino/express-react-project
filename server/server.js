const express = require("express");
const upload = require("express-fileupload");
const { parse } = require("csv-parse");
const fs = require("fs");

const app = express();
app.use(upload());

const path = "./uploads/file.csv";
let csvData = [];

// helper functions
const convertStringToNum = (csvData) => {
  csvData.forEach((row, id) => {
    if (id === 0) {
      return;
    }
    for (let i = 0; i < row.length; i++) {
      if (i !== 0) {
        row[i] = Number(row[i]);
        // to solve situation when user uploaded file with letters in cells in which should be nums
        if (isNaN(row[i])) {
          row[i] = 0;
        }
      }
    }
  });
  return csvData;
};

// following code checks if there is already an uploaded file
// if yes, send it back to frontend
app.get("/fetch", (req, res) => {
  csvData = [];
  if (fs.existsSync(path)) {
    const file = __dirname + "/uploads/file.csv";
    fs.createReadStream(file)
      .pipe(
        parse({
          delimiter: ",",
        })
      )
      .on("data", (dataRow) => {
        csvData.push(dataRow);
      })
      .on("end", () => {
        // console.log("before cleaning data", csvData);
        convertStringToNum(csvData);
        // console.log("after cleaning data", csvData);
        res.status(201).send(csvData);
      });
  } else {
    res.sendStatus(204);
  }
});

// save file to 'uploads' directory:
app.post("/data", (req, res) => {
  if (req.files) {
    csvData = [];
    const file = req.files.csv;
    const filename = file.name;
    file.mv(`./uploads/${filename}`, (err) => {
      if (err) {
        res.send(err);
      } else {
        fs.createReadStream(__dirname + `/uploads/${filename}`)
          .pipe(
            parse({
              delimiter: ",",
            })
          )
          .on("data", (dataRow) => {
            csvData.push(dataRow);
          })
          .on("end", () => {
            convertStringToNum(csvData);
            res.send(csvData);
          })
          .on("error", (err) => {
            fs.unlinkSync(path);
            res.status(422).send({
              message:
                "Obsah CSV souboru není správně formátovaný. Opravte jej, tak aby splňoval požadované zadání, a pak jej znovu nahrajte.",
            });
          });
      }
    });
  }
});

// remove file from the server
app.delete("/delete", (req, res) => {
  try {
    fs.unlinkSync(path);
    res.send("Soubor smazán.");
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
