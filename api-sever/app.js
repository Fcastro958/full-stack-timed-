
const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
// const port = 4000;
// const pool = new Pool({
//     user: 'postgres',
//     host: '127.0.0.1',
//     database: 'roaster_d',
//     password: 'docker',
//     port: 5432,
// });
const config=require('./config')[process.env.NODE_ENV||'dev'];
const PORT = config.port;
const pool= new Pool({
    connectionString: config.connectionString
});
pool.connect();
const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/roaster', (req, res)=>{
    async function getRoaster(){
        try{
            const result = await pool.query('SELECT * FROM roaster');
            console.log(result);
            res.send(result.rows);
        } catch(e) {
            console.error(e.stack);
        }
    }
    getRoaster();
});

app.get('/roaster/:id', (req, res)=>{
    async function getRoasterById(){
        try{
            const result = await pool.query(`SELECT * FROM roaster WHERE id = ${req.params.id}`);
            console.log(result);
            res.send(result.rows);
        } catch (e){
            console.error(e.stack);
        }
    }
    getRoasterById();
});

app.delete('/roaster/:id', (req , res)=> {
    async function deleteRoasterById() {
        try{
            const result = await pool.query(`DELETE FROM roaster WHERE id = ${req.params.id}`);
            res.status(204).send(result.rows);
        } catch (e) {
            console.error(e.stack);
        }
    }
    deleteRoasterById();
});

app.post('/roaster', (req, res)=>{
    async function updateRoaster() {
        try {
            let roaster = req.body;
            let first_name = roaster.first_name;
            let last_name = roaster.last_name;
            let age = roaster.age;
            const result = await pool.query(`INSERT INTO roaster (first_name, last_name, age) VALUES ('${first_name}', '${last_name}', ${age})`);
            console.log('updated');
            res.status(204).send(result.rows);
        } catch(e) {
            console.error(e.stack);
        }
    }
    updateRoaster();
});

app.patch('/roaster/:id', (req, res)=>{
    async function updateUser() {
        try{
            let roaster = req.body;
            let first_name = roaster.first_name;
            let last_name = roaster.last_name;
            let age = roaster.age;
            const result = await pool.query(`UPDATE roaster SET first_name ='${first_name}', last_name='${last_name}', age= ${age} WHERE id = ${req.params.id}`);
            console.log('updated user');
            res.status(204).send(result.rows);
        } catch (e) {
            console.log(e.stack);
        }
    }
    updateUser();
});


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});