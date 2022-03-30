import './setup.js'
import express from 'express';
import cors from 'cors';
import { connection } from './database.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/alunos', async (req, res) => {
    const {
        nome,
        cpf,
        email
    } = req.body;

    await connection.query(`
        INSERT INTO aluno
            (nome, cpf, email)
        VALUES
            ($1, $2, $3);
    `, [nome, cpf, email]);

    res.sendStatus(201);
})

app.get('/alunos', async (req, res) => {
    const alunos = await connection.query('SELECT * FROM aluno;');
    
    res.send(alunos.rows);
});

app.put('/alunos/:id', async (req, res) => {
    const{
        nome,
        cpf,
        email
    } = req.body;
    const {
        id
    } = req.params;

    await connection.query(`
        UPDATE aluno SET nome=$1, cpf=$2, email=$3 WHERE id=$4; 
        
    `, [nome, cpf, email, id]);
    res.sendStatus(201);
})

app.delete('/alunos/:id', async (req, res) => {
    const {
        id
    } = req.params;

    await connection.query(`
        DELETE FROM aluno WHERE id=$1;
        
    `, [id]);

    res.sendStatus(204);
})

app.post('/alunos/:id/matricula', async (req, res) => {
    const id = Number(req.params.id);

    const {
        turmaId,
    } = req.body;

    const matricula = await connection.query(`
        INSERT INTO aluno_turma
            (aluno_id, turma_id)
        VALUES ($1, $2)
        RETURNING *;
    `, [id, turmaId]);

    res.send(matricula.rows[0]);
})

app.get('/alunos/turmas/', async (req, res) => {
    const consulta = await connection.query(`
        SELECT
            aluno.nome AS "alunoNome",
            aluno_turma.data_inicio, aluno_turma.data_fim,
            turma.codigo
        FROM aluno
        JOIN aluno_turma
            ON aluno.id = aluno_id
        JOIN turma
            ON turma_id = turma.id;
    `);

    res.send(consulta.rows);
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
