CREATE TABLE "nota" (
	"id" serial NOT NULL,
	"nome" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "nota_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "aluno_turma" (
	"id" serial NOT NULL,
	"aluno_id" integer NOT NULL,
	"turma_id" integer NOT NULL,
	"data_inicio" TIMESTAMP NOT NULL DEFAULT 'now()',
	"data_fim" TIMESTAMP,
	CONSTRAINT "aluno_turma_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "projeto" (
	"id" serial NOT NULL,
	"nome" varchar(255) NOT NULL,
	"modulo_id" integer NOT NULL,
	"data_entrega" DATE NOT NULL,
	CONSTRAINT "projeto_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "aluno" (
	"id" serial NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cpf" varchar(11) NOT NULL UNIQUE,
	"email" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "aluno_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "turma" (
	"id" serial NOT NULL,
	"codigo" varchar(3) NOT NULL UNIQUE,
	"professor" varchar(255) NOT NULL,
	"representante" integer NOT NULL,
	CONSTRAINT "turma_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "modulo" (
	"id" serial NOT NULL,
	"nome" varchar(255) NOT NULL,
	"turma_id" integer NOT NULL,
	CONSTRAINT "modulo_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "aluno_projeto" (
	"id" serial NOT NULL,
	"aluno_id" integer NOT NULL,
	"nota_id" integer,
	"projeto_id" integer NOT NULL,
	"data_entrega" TIMESTAMP NOT NULL DEFAULT 'now()',
	CONSTRAINT "aluno_projeto_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "aluno_turma" ADD CONSTRAINT "aluno_turma_fk0" FOREIGN KEY ("aluno_id") REFERENCES "aluno"("id");
ALTER TABLE "aluno_turma" ADD CONSTRAINT "aluno_turma_fk1" FOREIGN KEY ("turma_id") REFERENCES "turma"("id");

ALTER TABLE "projeto" ADD CONSTRAINT "projeto_fk0" FOREIGN KEY ("modulo_id") REFERENCES "modulo"("id");


ALTER TABLE "turma" ADD CONSTRAINT "turma_fk0" FOREIGN KEY ("representante") REFERENCES "aluno"("id");

ALTER TABLE "modulo" ADD CONSTRAINT "modulo_fk0" FOREIGN KEY ("turma_id") REFERENCES "turma"("id");

ALTER TABLE "aluno_projeto" ADD CONSTRAINT "aluno_projeto_fk0" FOREIGN KEY ("aluno_id") REFERENCES "aluno"("id");
ALTER TABLE "aluno_projeto" ADD CONSTRAINT "aluno_projeto_fk1" FOREIGN KEY ("nota_id") REFERENCES "nota"("id");
ALTER TABLE "aluno_projeto" ADD CONSTRAINT "aluno_projeto_fk2" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("id");



ALTER TABLE "aluno_projeto"
	ADD "longitude" varchar(255) NOT NULL DEFAULT '--';

ALTER TABLE "aluno_projeto"
	ADD "latitude" varchar(255) NOT NULL DEFAULT '--';



ALTER TABLE "turma"
	DROP CONSTRAINT "turma_fk0",
	ADD CONSTRAINT "turma_fk0" FOREIGN KEY ("representante") REFERENCES "aluno"("id")
   	ON DELETE CASCADE;



ALTER TABLE "aluno_turma"
	DROP CONSTRAINT "aluno_turma_fk0",
	ADD CONSTRAINT "aluno_turma_fk0" FOREIGN KEY ("aluno_id") REFERENCES "aluno"("id")
   	ON DELETE CASCADE;

ALTER TABLE "aluno_turma"
	DROP CONSTRAINT "aluno_turma_fk1",
	ADD CONSTRAINT "aluno_turma_fk1" FOREIGN KEY ("turma_id") REFERENCES "turma"("id")
   	ON DELETE CASCADE;




ALTER TABLE "aluno_projeto"
	DROP CONSTRAINT "aluno_projeto_fk0",
	ADD CONSTRAINT "aluno_projeto_fk0" FOREIGN KEY ("aluno_id") REFERENCES "aluno"("id")
   	ON DELETE CASCADE;
	   
ALTER TABLE "aluno_projeto"
	DROP CONSTRAINT "aluno_projeto_fk1",
	ADD CONSTRAINT "aluno_projeto_fk1" FOREIGN KEY ("nota_id") REFERENCES "nota"("id")
   	ON DELETE CASCADE;

ALTER TABLE "aluno_projeto"
	DROP CONSTRAINT "aluno_projeto_fk2",
	ADD CONSTRAINT "aluno_projeto_fk2" FOREIGN KEY ("projeto_id") REFERENCES "projeto"("id")
   	ON DELETE CASCADE;







INSERT INTO nota (nome) VALUES ('Abaixo das expectativas'), ('Dentro das expectativas'), ('Acima das expectativas');

INSERT INTO modulo (nome, turma_id) VALUES ('Módulo 1', 1), ('Módulo 2', 1), ('Módulo 3', 1), ('Módulo 4', 1), ('Módulo 5', 1);

INSERT INTO projeto (nome, modulo_id, data_entrega) VALUES ('Projeto 1', 1, '2022/04/18'), ('Projeto 2', 1, '2022/04/26'), ('Projeto 3', 1, '2022/04/30'), ('Projeto 4', 1, '2022/05/05'), ('Projeto 5', 1, '2022/05/14');

