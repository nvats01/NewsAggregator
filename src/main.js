const axios = require("axios");
const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const isValid = require("./helpers/isValidEmail");
const app = express();
const port = 3000;
const Users = require("./Datas/User.json");
const NewsPreferences = require("./Datas/NewsPreferences.json");
const { type } = require("os");
const tasks = [];
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  if (req.body) {
    if (isValid(req.body.email)) {
      if (req.body.password != undefined) {
        let pass = bcrypt.hashSync(req.body.password, 8);
        let user = {
          email: req.body.email,
          password: pass,
        };
        let modifiedData = JSON.parse(JSON.stringify(Users));
        modifiedData.push(user);
        let writePath = path.join(__dirname, "./Datas", "User.json");
        fs.writeFileSync(writePath, JSON.stringify(modifiedData), {
          encoding: "utf-8",
          flag: "w",
        });
        return res.status(200).send("User registered successfully");
      }
    } else {
      return res.status(500).send("Invalid email");
    }
  } else {
    throw new Error("No body");
  }
});
app.post("/login", (req, res) => {
  if (req.body) {
    if (isValid(req.body.email)) {
      if (req.body.password != undefined) {
        let resUser = Users.filter((user) => {
          return user.email == req.body.email;
        });
        if (resUser.length == 0) return res.status(500).send("User not found!");
        const hashedPass = bcrypt.compareSync(
          req.body.password,
          resUser[0].password
        );
        if (!hashedPass) return res.status(401).send("Invalid password");
        return res.status(200).send("User logged in successfully");
      }
    } else {
      return res.status(500).send("Invalid email");
    }
  } else {
    throw new Error("No body");
  }
});
app.get("/news", async (req, res) => {
  const params = {
    q: "tesla",
    from: "2023-10-30",
    sortBy: "publishedAt",
    apiKey: "ca12f27bcee94e04b6518cc281d5f355",
  };
  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params,
    });
    let filteredResponse = response.data.articles.filter((data) => {
      return NewsPreferences.some((e) => e.source == data.source.name);
    });
    if (filteredResponse.length == 0) {
      res.status(500).send("No news with respect to user preferance exists");
    }
    res.status(201).send(filteredResponse);
  } catch (err) {
    res.status(404).send(err);
  }
});
app.post("/newsPreferences", (req, res) => {
  if (req.body) {
    let readPath = path.join(__dirname, "./Datas", "NewsPreferences.json");
    const data = fs.readFileSync(readPath, {
      encoding: "utf-8",
      flag: "r",
    });
    let modifiedData = JSON.parse(data);
    modifiedData.sources.push(req.body);
    let writePath = path.join(__dirname, "./Datas", "NewsPreferences.json");
    fs.writeFile(
      writePath,
      JSON.stringify(modifiedData),
      {
        encoding: "utf-8",
        flag: "w",
      },
      (err) => {
        if (err) {
          ("Error in writing file");
        } else {
          res.status(200).send("News preferences added successfully");
        }
      }
    );
  }
});

app.put("/newsPreferences/:id", (req, res) => {
  if (req.body) {
    let index = -1;
    let readPath = path.join(__dirname, "./Datas", "NewsPreferences.json");
    const data = fs.readFileSync(readPath, {
      encoding: "utf-8",
      flag: "r",
    });
    let dataToRead = JSON.parse(data);
    for (let news of dataToRead.sources) {
      if (news.id == req.params.id) {
        index = dataToRead.sources.indexOf(news);
        break;
      }
    }
    if (index != -1) dataToRead.sources.splice(index, 1);
    let modifiedData = JSON.parse(JSON.stringify(dataToRead));
    modifiedData.sources.push(req.body);
    let writePath = path.join(__dirname, "./Datas", "NewsPreferences.json");
    fs.writeFileSync(writePath, JSON.stringify(modifiedData), {
      encoding: "utf-8",
      flag: "w",
    });
    res.status(200).send("News preferences updated successfully");
  }
});

app.get("/newsPreferences", (req, res) => {
  let readPath = path.join(__dirname, "./Datas", "NewsPreferences.json");
  const data = fs.readFileSync(readPath, {
    encoding: "utf-8",
    flag: "r",
  });
  res.status(200).send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
