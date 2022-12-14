create table genesys.users (
  id serial primary key,
  name varchar(20) not null,
  email varchar(30) not null,
  password varchar(240) not null,
  last_login timestamp without time zone,
  created_at timestamp without time zone default current_timestamp
);

create unique index idx_users_username__email on genesys.users(email);
