const express = require("express");
const upload = require("express-fileupload");
const { parse } = require("csv-parse");
const fs = require("fs");

const app = express();

let csvData = [];

app.use(upload());

// following code checks if there is already an uploaded file
app.get("/data", (req, res) => {
  csvData = [];
  if (fs.existsSync("./uploads/file.csv")) {
    console.log("file exists");
    const file = __dirname + "/uploads/file.csv";
    console.log(file);
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
        console.log(csvData);
        res.send(csvData);
      });
  } else {
    console.log("file does not exist");
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
            console.log("before cleaning data", csvData);
            // converts strings into nums within appropriate cells
            csvData.forEach((row, id) => {
              if (id === 0) {
                return;
              }
              for (let i = 0; i < row.length; i++) {
                if (i !== 0) {
                  row[i] = Number(row[i]);
                }
              }
            });
            console.log("after cleaning data", csvData);
            res.send(csvData);
          });
      }
    });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
