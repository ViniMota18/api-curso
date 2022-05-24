import './setup.js'
import express from 'express';
import cors from 'cors';
import xmlparser from 'express-xml-bodyparser';
import { connection } from './database.js';
import json2xml from 'json2xml';
import readlineSync from 'readline-sync';

const app = express();

app.use(cors());
app.use(express.json());
app.use(xmlparser());

let applicationType = 'json';

app.post('/alunos', async (req, res) => {
    let {
        nome,
        cpf,
        email
    } = req.body;

    if (applicationType === 'xml') {
        nome = req.body.root.nome[0];
        cpf = req.body.root.cpf[0];
        email = req.body.root.email[0];
    }

    try {
        const aluno = await connection.query(`
            INSERT INTO aluno
                (nome, cpf, email)
            VALUES
                ($1, $2, $3)
            RETURNING *;
        `, [nome, cpf, email]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(aluno.rows[0], { header: true }))
        }

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/alunos', async (req, res) => {
    try {
        const alunos = await connection.query('SELECT * FROM aluno;');

        if (applicationType === 'xml') {        
            return res.send(json2xml(alunos.rows, { header: true }))
        }
        
        res.send(alunos.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.patch('/alunos/:id', async (req, res) => {
    let {
        email
    } = req.body;

    if (applicationType === 'xml') {
        email = req.body.root.email[0];
    }

    const {
        id
    } = req.params;

    try {
        const searchEmail = await connection.query(`
            SELECT * FROM aluno
            WHERE email = $1;
        `, [email]);

        if (searchEmail.rowCount) {
            return res.status(409).send('Email já cadastrado');
        }

        await connection.query(`
            UPDATE aluno SET email=$1 WHERE id=$2; 
            
        `, [email, Number(id)]);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.delete('/turmas/:id', async (req, res) => {
    const {
        id
    } = req.params;

    try {
        await connection.query(`
            DELETE 
            FROM turma
            WHERE id = $1;
        `, [id]);

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.patch('/turmas/:id/formar', async (req, res) => {
    const {
        id
    } = req.params;

    try {
        await connection.query(`
            UPDATE aluno_turma
            SET data_fim = NOW()
            WHERE turma_id = $1;
        `, [id]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.delete('/alunos/:id', async (req, res) => {
    const {
        id
    } = req.params;

    try {
        await connection.query(`
            DELETE 
            FROM aluno
            WHERE id = $1;
        `, [id]);

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/alunos/:id/matricula', async (req, res) => {
    const id = Number(req.params.id);
    const {
        turma_id: turmaId,
    } = req.body;
    
    try {
        const matricula = await connection.query(`
            INSERT INTO aluno_turma
                (aluno_id, turma_id)
            VALUES ($1, $2)
            RETURNING *;
        `, [id, turmaId]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(matricula.rows[0], { header: true }))
        }

        res.send(matricula.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/alunos/turmas/', async (req, res) => {
    try {
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

        if (applicationType === 'xml') {        
            return res.send(json2xml(consulta.rows, { header: true }))
        }

        res.send(consulta.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/alunos/turmas/:turma', async (req, res) => {
    const { turma } = req.params;
    
    try {
        const consulta = await connection.query(`
            SELECT
                aluno.id,
                aluno.nome AS "alunoNome",
                aluno_turma.data_inicio, aluno_turma.data_fim,
                turma.codigo
            FROM aluno
            JOIN aluno_turma
                ON aluno.id = aluno_id
            JOIN turma
                ON turma_id = turma.id
            WHERE turma.id = $1;
        `, [turma]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(consulta.rows, { header: true }))
        }

        res.send(consulta.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.put('/alunos/:id/matricula', async (req, res) => {
    const id = Number(req.params.id);

    const {
        turma_id: turmaId,
    } = req.body;

    try {
        const matricula = await connection.query(`
            UPDATE aluno_turma
            SET data_fim = NOW()
            WHERE aluno_id = $1 AND turma_id = $2
            RETURNING *;
        `, [id, turmaId]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(matricula.rows[0], { header: true }))
        }

        res.send(matricula.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.put('/alunos/:id/matricula', async (req, res) => {
    const id = Number(req.params.id);

    const {
        turma_id: turmaId,
    } = req.body;

    try {
        const matricula = await connection.query(`
            UPDATE aluno_turma
            SET data_fim = NOW()
            WHERE aluno_id = $1 AND turma_id = $2
            RETURNING *;
        `, [id, turmaId]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(matricula.rows[0], { header: true }))
        }

        res.send(matricula.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/alunos/:id/projeto', async (req, res) => {
    let {
        projeto_id: projetoId,
        latitude,
        longitude,
    } = req.body;
    
    const { id } = req.params;

    if (applicationType === 'xml') {
        projetoId = req.body.root.projeto_id[0];
        latitude = req.body.root.latitude[0];
        longitude = req.body.root.longitude[0];
    }

    try {
        const alunoProjeto = await connection.query(`
            INSERT INTO aluno_projeto
                (aluno_id, nota_id, projeto_id, latitude, longitude)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [id, 4, projetoId, latitude, longitude]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(alunoProjeto.rows[0], { header: true }))
        }

        res.send(alunoProjeto.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.put('/alunos/:id/projeto', async (req, res) => {
    let {
        nota_id: notaId,
        projeto_id: projetoId,
    } = req.body;
    
    const { id } = req.params;

    if (applicationType === 'xml') {
        notaId = req.body.root.nota_id[0];
        projetoId = req.body.root.projeto_id[0];
    }

    try {
        const alunoProjeto = await connection.query(`
            UPDATE aluno_projeto
            SET nota_id = $1
            WHERE projeto_id = $2 AND aluno_id = $3
            RETURNING *;
        `, [notaId, projetoId, id]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(alunoProjeto.rows[0], { header: true }))
        }

        res.send(alunoProjeto.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/alunos/:id/projeto', async (req, res) => {
    const { id } = req.params;

    try {
        const alunoProjetos = await connection.query(`
            SELECT 
                aluno.nome AS aluno,
                projeto.nome AS projeto,
                projeto.data_entrega AS prazo,
                aluno_projeto.data_entrega AS entrega,
                aluno_projeto.nota_id AS nota
            FROM aluno_projeto
            JOIN aluno
                ON aluno_id = aluno.id
            JOIN projeto
                ON projeto_id = projeto.id
            WHERE aluno_id = $1;
        `, [id]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(alunoProjetos.rows, { header: true }))
        }

        res.send(alunoProjetos.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/projetos', async (req, res) => {
    let {
        nome,
        modulo_id: moduloId,
        data_entrega: dataEntrega,
    } = req.body;

    if (applicationType === 'xml') {
        nome = req.body.root.nome[0];
        moduloId = req.body.root.modulo_id[0];
        dataEntrega = req.body.root.data_entrega[0];
    }

    try {
        const projeto = await connection.query(`
            INSERT INTO projeto
                (nome, modulo_id, data_entrega)
            VALUES
                ($1, $2, $3)
            RETURNING *;
        `, [nome, moduloId, dataEntrega]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(projeto.rows[0], { header: true }))
        }

        res.send(projeto.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/projetos', async (req, res) => {
    try {
        const projetos = await connection.query(`
            SELECT 
                projeto.id, projeto.nome,
                modulo.nome AS modulo,
                projeto.data_entrega AS prazo 
            FROM projeto
            JOIN modulo
                ON modulo_id = modulo.id;`);

        if (applicationType === 'xml') {        
            return res.send(json2xml(projetos.rows, { header: true }))
        }

        res.send(projetos.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/projetos/:id', async (req, res) => {
    const {
        id
    } = req.params;

    try {
        await connection.query(`
            DELETE 
            FROM projeto
            WHERE id = $1;
        `, [id]);

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/projetos/modulos/:modulo', async (req, res) => {
    const { modulo } = req.params;

    try {
        const projetos = await connection.query(`
            SELECT 
                projeto.id, projeto.nome,
                modulo.nome AS modulo,
                projeto.data_entrega AS prazo 
            FROM projeto
            JOIN modulo
                ON modulo_id = modulo.id
            WHERE modulo_id = $1;`, [modulo]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(projetos.rows, { header: true }))
        }

        res.send(projetos.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/modulos', async (req, res) => {
    let {
        nome,
        turma_id: turmaId,
    } = req.body;

    if (applicationType === 'xml') {
        nome = req.body.root.nome[0];
        turmaId = req.body.root.turma_id[0];
    }

    try {
        const modulo = await connection.query(`
            INSERT INTO modulo
                (nome, turma_id)
            VALUES
                ($1, $2)
            RETURNING *;
        `, [nome, turmaId]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(modulo.rows[0], { header: true }))
        }

        res.send(modulo.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/modulos', async (req, res) => {
    try {
        const modulos = await connection.query(`
            SELECT 
                modulo.id, modulo.nome,
                turma.codigo AS turma
            FROM modulo
            JOIN turma
                ON turma_id = turma.id;
        `);

        if (applicationType === 'xml') {        
            return res.send(json2xml(modulos.rows, { header: true }))
        }

        res.send(modulos.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/turmas', async (req, res) => {
    let {
        codigo,
        professor,
        representante,
    } = req.body;

    if (applicationType === 'xml') {
        codigo = req.body.root.codigo[0];
        professor = req.body.root.professor[0];
        representante = req.body.root.representante[0];
    }

    try {
        const turma = await connection.query(`
            INSERT INTO turma
                (codigo, professor, representante)
            VALUES
                ($1, $2, $3)
            RETURNING *;
        `, [codigo, professor, representante]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(turma.rows[0], { header: true }))
        }

        res.send(turma.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/turmas', async (req, res) => {
    try {
        const turmas = await connection.query(`
            SELECT 
                turma.id, turma.codigo, turma.professor,
                aluno.nome as representante 
            FROM turma
            JOIN aluno
                ON representante = aluno.id;
        `);

        if (applicationType === 'xml') {        
            return res.send(json2xml(turmas.rows, { header: true }))
        }

        res.send(turmas.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.put('/turmas', async (req, res) => {
    let {
        codigo,
        professor,
        representante,
    } = req.body;

    if (applicationType === 'xml') {
        codigo = req.body.root.codigo[0];
        professor = req.body.root.professor[0];
        representante = req.body.root.representante[0];
    }

    const { id } = req.params;

    try {
        const turma = await connection.query(`
            UPDATE turma
            SET
                codigo = $1, professor = $2, representante = $3)
            WHERE id = $4
            RETURNING *;
        `, [codigo, professor, representante, id]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(turma.rows[0], { header: true }))
        }

        res.send(turma.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/notas', async (req, res) => {
    const {
        nome,
    } = req.body;

    try {
        const nota = await connection.query(`
            INSERT INTO nota
                (nome)
            VALUES
                ($1)
            RETURNING *;
        `, [nome]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(nota.rows[0], { header: true }))
        }

        res.send(nota.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/notas', async (req, res) => {
    try {
        const notas = await connection.query('SELECT * FROM nota;');

        if (applicationType === 'xml') {        
            return res.send(json2xml(notas.rows, { header: true }))
        }

        res.send(notas.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.put('/notas/:id', async (req, res) => {
    const {
        nome,
    } = req.body;

    const { id } = req.params;

    try {
        const nota = await connection.query(`
            UPDATE nota
            SET
                nome = $1
            WHERE id = $2
            RETURNING *;
        `, [nome, id]);

        if (applicationType === 'xml') {        
            return res.send(json2xml(nota.rows[0], { header: true }))
        }

        res.send(nota.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.delete('/notas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query('DELETE FROM nota WHERE id = $1;', [id]);

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.listen(process.env.PORT, () => {
    readlineSync.setDefaultOptions({limit: ['json', 'xml']});
    applicationType = readlineSync.question('JSON or XML? ');
    console.log(`Server running on port ${process.env.PORT}`);
});
