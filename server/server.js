const express = require("express");
const upload = require("express-fileupload");
const { parse } = require("csv-parse");
const fs = require("fs");

const app = express();

let csvData = [];

app.use(upload());

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
app.get("/data", (req, res) => {
  csvData = [];
  if (fs.existsSync("./uploads/file.csv")) {
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
        res.send(csvData);
      });
  }
});

// remove file from the server
app.delete("/delete", (req, res) => {
  try {
    fs.unlinkSync("./uploads/file.csv");
    res.send("File deleted.");
  } catch (err) {
    console.log(err);
  }
});

// save file to 'uploads' directory:
app.post("/data", (req, res) => {
  // console.log(req);
  if (req.files) {
    csvData = [];
    const file = req.files.csv;
    const filename = file.name;
    file.mv(`./uploads/${filename}`, (err) => {
      if (err) {
        res.send(err); // later make this better
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
            //console.log("before cleaning data", csvData);
            convertStringToNum(csvData);
            //console.log("after cleaning data", csvData);
            res.send(csvData);
          })
          .on("error", (err) => {
            fs.unlinkSync("./uploads/file.csv");
            res.status(422).send({
              message:
                "Obsah CSV souboru není správně formátovaný. Opravte jej, tak aby splňoval požadované zadání, a pak jej znovu nahrajte.",
            });
          });
      }
    });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
