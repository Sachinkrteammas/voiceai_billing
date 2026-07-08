from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Change according to your database

DATABASE_URL = "mysql+pymysql://root:dial%40mas123@192.168.10.12/db_dialdesk?charset=utf8mb4"

DATABASE_URL2 = "mysql+pymysql://root:dial%40mas123@172.12.10.22/voiceai_billing?charset=utf8mb4"

engine4 = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal4 = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine4
)


def get_db4():
    db = SessionLocal4()
    try:
        yield db
    finally:
        db.close()


engine2 = create_engine(
    DATABASE_URL2,
    pool_pre_ping=True
)

SessionLocal2 = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine2
)


def get_db2():
    db = SessionLocal2()
    try:
        yield db
    finally:
        db.close()