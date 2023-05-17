create table if not exists developers (
	id serial primary key,
	name varchar(50) not null,
	email varchar(50) unique not null
);

create table if not exists developers_info (
	id serial primary key,
	developerSince date not null,
	"preferedOs" varchar(20) check ("preferedOs" in ('Windows', 'Linux', 'MacOs')),
	"developerId" integer unique not null,
	foreign key ("developerId") references developers(id)
);
create table if not exists projects (
	id serial primary key,
	name varchar(50) not null,
	description varchar(50),
	"estimateTime" varchar(50) not null,
	repository varchar(50) not null,
	"startDate" date not null, 
	"developerId" integer not null,
	foreign key ("developerId") references developers(id)
);
create table if not exists techlogies (
	id serial primary key,
	name varchar(30) not null
);
create table if not exists projects_technologies(
	id serial primary key,
	"addIn" date not null,
	"technologyId" integer not null,
	"projectId" integer unique not null,
	foreign key ("technologyId") references technologies(id) on delete cascade,
	foreign key ("projectId") references projects(id) on delete cascade
);