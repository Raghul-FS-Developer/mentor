var express = require("express");
var router = express.Router();
const { dbUrl, mongodb, MongoClient, dbNAme } = require("../dbConfig");
/* GET home page. */
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db(dbNAme);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});
//Write API to create Mentor
router.post("/create-mentor", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const dd = req.body;
    let db = await client.db(dbNAme);
    let document = await db.collection("mentor").insertOne(req.body);
    res.json({
      message: "mentor added successfully",
      dd,
    });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});
//Write API to create Student
router.post("/create-student", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const dd = req.body;
    let db = await client.db(dbNAme);
    let document = await db.collection("students").insertOne(req.body);
    res.json({
      message: "student added successfully",
      dd,
    });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});
//Write API to Assign a student to Mentor

router.post("/:id", async (req, res) => {
  let mentorid = req.params.id;
  
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbNAme);
    const result = await db
      .collection("mentor")
      .findOne({ _id: mongodb.ObjectId(mentorid) })
 
    if (result) {
      console.log("mentor present");
      const result1 = await db
        .collection("students")
        .findOne({ _id: mongodb.ObjectId(req.body.studentid) })
      if (result1) {
        console.log("student present");

        const result2 = await db
          .collection("mentor")
          .findOne({
            studentIds: req.body.studentid
          });
        if (result2) {
          console.log("student has a mentor");
          res.json({
            message: "student has a mentor",
          });
        } else {
          await db
            .collection("mentor")
            .updateOne(
              { _id: mongodb.ObjectId(mentorid) },
              { $push: { studentIds: req.body.studentid } }
            );
          res.json({
            message: "student assigned to the mentor successfully",
          });
          console.log("student assigned to the mentor successfully");
        }
      } else {
        console.log("invalid student ");
        res.json({
          message: "invalid student",
        });
      }
    } 
else {
      console.log("invalid mentor");
      res.json({
        message: "invalid mentor",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

//Write API to Assign or Change Mentor for particular Student
// you can assign one mentor and change the mentor 
router.post("/assign/:id", async (req, res) => {
  let studentid = req.params.id;

  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbNAme);
    const query1 = await db
      .collection("students")
      .findOne({ _id: mongodb.ObjectId(studentid) });
    if (query1) {
      console.log("student present");
      const query2 = await db
        .collection("mentor")
        .findOne({ _id: mongodb.ObjectId(req.body.mentorid) });
      if (query2) {
        console.log("mentor present");
        await db
          .collection("students")
          .updateOne(
            { _id: mongodb.ObjectId(studentid) },
            { $set: { assigned_mentor: query2 } }
          );
        res.json({
          statusCode: 200,
          message: "mentor assigned to student successfully",
        });
      } else {
        res.json({
          message: "invalid mentor",
        });
        console.log("invalid mentor");
      }
    } else {
      res.json({
        message: "invalid student",
      });
      console.log("invalid student");
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});
//Write API to show all students for a particular mentor
router.get("/:id",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);

 const mentorid = req.params.id
 try {
  const db = await client.db(dbNAme);
  const query1 = await db.collection('mentor').findOne({_id : mongodb.ObjectId(mentorid) })
  if(query1){
    res.json({
      studentids:query1.studentids
    })
    console.log("mentor present")
  }else{
    console.log("invalid mentor")
  }
 } catch (error) {
   console.log(error)
 }
})
module.exports = router;
