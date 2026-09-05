import psycopg
from psycopg.rows import dict_row
from app.core.config import database_url


def connect():
    return psycopg.connect(database_url(), row_factory=dict_row, connect_timeout=5)


def get_connection():
    # Commit only if the entire request succeeds; otherwise roll back.
    with connect() as connection:
        yield connection
