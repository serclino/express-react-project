# Cost calculation

The tool which lets you upload CSV file, displays table data and calculates final costs depending on your inputs. Then you can export that data (also in CSV file).

## Installation & Running the App

From root directory -> go to:
a) client dir: cd client -> npm install -> npm start
b) server dir: cd server -> npm install -> node server

## Technologies

- React
- Express.js

## Requirements for the project

[x] uplad CSV and save it to the backend side
[x] render table displaying data from CSV (if they are presented)
[x] in each row you can choose only one value
[x] at the end of each row, there is an additional input called "Jiné" - user can write in any number
[x] under the table there is overview of total hours, input for wage per hour and total cost
[x] export selected table data as a CSV file

## Bonuses

[x] validation: 1. only CSV file can uploaded, 2. if CVS content doesn't have proper form (i.e. short rows), then user is alerted
[x] on the first render, file is fetched to the client side, if it's already uploaded
[x] delete button - it deletes file from the backend
[x] if CSV cells contains letters (or empty cells) in place where should be numbers, then "0" is rendered
[x] radio input with value 0 is disabled and cannot be choosed
[x] when any input is selected within some of the rows, then "0" is exported

## Limits and future

From UI perspective, this isn't optimal. Something to work on in the future.
