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