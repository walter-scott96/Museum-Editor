create table Tour(
	name varchar(100) not null,
	description varchar(2048),
	image varchar(256),
	primary key (name)
);

create table Location(
	name varchar(100) not null,
	description varchar(2048),
	lat decimal(10,8) not null,
	lon decimal(11,8) not null,
	primary key (name)
);

create table Item(
	name varchar(100) not null,
	description varchar(2048),
	category varchar(100) not null,
	primary key (name)
);

create table Image(
	filename varchar(256) not null,
	isThumbnail boolean not null,
	lname varchar(100),
	iname varchar(100),
	primary key (filename),
	foreign key (lName) references Location(name),
	foreign key (iName) references Item(name)
);

create table contain(
	tname varchar(100) not null,
	lname varchar(100) not null,
	primary key (tname,lname),
	foreign key (tname) references Tour(name),
	foreign key (lname) references Location(name)
);

create table related(
	lname varchar(100) not null,
	iname varchar(100) not null,
	primary key (lname,iname),
	foreign key (lname) references Location(name),
	foreign key (iname) references Item(name)
);