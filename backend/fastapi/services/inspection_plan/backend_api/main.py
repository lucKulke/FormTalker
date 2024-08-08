from fastapi import FastAPI
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()


@app.get("/")
def read_root():

    response = supabase.table("formsis").select("*").execute()
    print(response)
    return response


# app.include_router(security_routes.router)
