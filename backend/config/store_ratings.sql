create table if not exists users(
	id uuid default gen_random_uuid(),
	name varchar(60),
	email varchar(40) unique,
	password varchar(100),
	address varchar(400),
	userTypeId uuid default 'ee9ee709-6408-4d86-b5b4-f135c6b2e5b8',
	primary key(id),
	foreign	KEY(userTypeId) references userType(id)
);

create table if not exists userType(
id uuid default gen_random_uuid() primary key,
role varchar(40)
);
insert into userType(role) values ('admin');
select * from userType;

drop table admin;
insert into users (name,email,password,address) values('abc','abc@gmail.com','1234','kop');

select * from users;
delete from users u where u.id='0de86687-9e42-40d4-a16e-112faa081261';
select id, name,email,address from users;


select count(u.id) as admin from users u join userType ut ON u.userTypeId = ut.id where role ='admin';
select count(id) as users from users;

create table if not exists stores(
	id uuid default gen_random_uuid() primary key,
	storename varchar(200),
	email varchar(50) unique,
    password varchar(100),
	address varchar(400)
);
alter table stores drop column password;

drop table store_ratings;
create table if not exists store_ratings(
	id uuid default gen_random_uuid() primary key,
	rating int check(rating between 1 and 5),
	comments varchar(100),
	userId uuid ,
	userTypeId uuid,
	storeId uuid  ,
	foreign	KEY(userTypeId) references userType(id),
	foreign	KEY(userId) references users(id),
	foreign	KEY(storeId) references stores(id)
);

select * from stores;
select count(id) as stores from stores;
select * from store_ratings;

