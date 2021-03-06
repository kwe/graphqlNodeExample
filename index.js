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

async function getStudents() {
  const val = await pool
    .query(
      "select id, first_name as firstname, last_name as lastname from students_student"
    )
    .then(p => p.rows);
  return val;
}

async function getStudent(id) {
  const val = await pool
    .query(
      "select id, first_name as firstname, last_name as lastname from students_student where id = $1",
      [id]
    )
    .then(p => p.rows[0]);

  return val;
}

const resolvers = {
  Query: {
    students: () => getStudents(),
    student: (parent, args) => getStudent(args.id)
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

var ss = getStudents();
console.log(ss);
