import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.index import register_routes
from src.config.index import AI_SERVER_HOST, AI_SERVER_PORT


def create_app() -> FastAPI:
    app = FastAPI(title="AI Engine API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_routes(app)
    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    import sys

    if "reload" in sys.argv:
        uvicorn.run(
            "src.main:app", host=AI_SERVER_HOST, port=AI_SERVER_PORT, reload=True
        )
    else:
        uvicorn.run(app, host=AI_SERVER_HOST, port=AI_SERVER_PORT)
