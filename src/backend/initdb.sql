CREATE ROLE remind_me WITH LOGIN PASSWORD 'remind-me';

CREATE DATABASE remind_me OWNER remind_me;

GRANT ALL PRIVILEGES ON DATABASE remind_me TO remind_me;