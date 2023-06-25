const express = require("express");
const path = require("path");
const dbData = require("./db/db.json");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

//use the promisify util method to treat fs.writefile as a promise. Prevents the post method from finishing until the file is written. 
const writeFileAsync = util.promisify(fs.writeFile)

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(dbData));

app.post("/api/notes", (req, res) => {
  //Destructure req.body
  const { title, text } = req.body;
  // If title and text are present...
  if (title && text) {
    // //create a variable containing newNote object
    const newNote = {
      title,
      text,
      id: uuidv4()
    };

    // // Retrieve the contents of db.json
    // fs.readFile("./db/db.json", (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(500).json("Error in reading db.json");
    //   }
    //   // Save the contents of db.json as a variable and push the newNot object into the array
    //   let notes = JSON.parse(data);
    //   notes.push(newNote);

    //   // Stringify and return updated array to db.json
    //   fs.writeFile("./db/db.json", JSON.stringify(notes), (err) =>
    //     err
    //       ? console.error(err)
    //       : console.log(`Note for ${newNote.title} has been added!`)
    //   );

    //   const response = {
    //     status: "success",
    //     body: newNote,
    //   };
    //   console.log(response);
    //   res.status(201).json(response);
    // });

    // console.log(dbData);

    //push the new note to dbData
    dbData.push(newNote);

    // console.log(dbData);
      fs.writeFile("./db/db.json", JSON.stringify(dbData), (err) =>
        err
          ? console.error(err)
          : console.log(`Note for ${newNote.title} has been added!`)
      );
    res.json(dbData)
  } else {
    res.status(500).json("Error in posting note");
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
