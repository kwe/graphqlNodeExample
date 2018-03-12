const { GraphQLServer } = require("graphql-yoga");

const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: ""
});

const typeDefs = `
  type Query {
    hello(name: String):String!
  }
`;
const students = [];
let idCount = 0;

function getStudents() {
  pool.query(
    "SELECT id, first_name as firstname, last_name as lastname FROM students_student",
    (err, res) => {
      return res.rows;
    }
  );
}

const resolvers = {
  Query: {
    students: () => {
      console.log(students);
      return students;
    },
    student: (parent, args) => {
      pool.query(
        "SELECT id, first_name as firstname, last_name as lastname FROM students_student WHERE id = $1",
        [args.id],
        (err, res) => {
          if (err) {
            throw err;
          }
          return res.row;
        }
      );
    }
    // students.find(student => student.id === args / id)
  },
  Mutation: {
    createStudent: (parent, args) => {
      const student = {
        id: `student_${idCount++}`,
        firstname: args.firstname,
        lastname: args.lastname
      };
      students.push(student);
      return student;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers
});

server.start(() => console.log("Server s running on localhost:4000"));

pool.query("SELECT * FROM students_student WHERE id = $1", [1], (err, res) => {
  if (err) {
    throw err;
  }

  console.log("student:", res.rows[0]);
});
