# generator.py

import secrets
import hashlib
from pathlib import Path


def generate_secret_key():
    # Generate a 64-character secure random key, then hash it with SHA-256
    random_bytes = secrets.token_bytes(64)
    return hashlib.sha256(random_bytes).hexdigest()

def generate_password(length=32):
    return secrets.token_urlsafe(length)

def write_env_file():
    secret_key = generate_secret_key()
    db_password = generate_password()
    
    env_contents = f"""\
SECRET_KEY={secret_key}
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=carbonjar_db
DB_USER=carbon_user
DB_PASSWORD={db_password}
DB_HOST=localhost
DB_PORT=5432
"""

    env_path = Path('.') / '.env'
    with open(env_path, 'w') as env_file:
        env_file.write(env_contents)

    print(f".env file created at {env_path.resolve()}")
    print("SECRET_KEY and DB_PASSWORD generated securely.")

if __name__ == "__main__":
    write_env_file()
