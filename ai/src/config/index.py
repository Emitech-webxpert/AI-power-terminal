import os
import sys
import json


def find_up(filename: str, start_path: str = ".") -> str | None:
    path = os.path.abspath(start_path)
    while True:
        candidate = os.path.join(path, filename)
        if os.path.isfile(candidate):
            return candidate
        parent = os.path.dirname(path)
        if parent == path:
            return None
        path = parent


def get_config_path():
    if getattr(sys, "frozen", False):
        config_path = os.path.join(sys._MEIPASS, "config.json")
        if os.path.isfile(config_path):
            return config_path
        raise FileNotFoundError(
            f"Expected config.json at {config_path}, but not found or not a file."
        )
    config_path = find_up("config.json", start_path=os.path.dirname(__file__))
    if config_path:
        return config_path
    raise FileNotFoundError("config.json not found")


with open(get_config_path(), "r") as f:
    config = json.load(f)

AI_SERVER_HOST = config.get("AI_SERVER_HOST")
AI_SERVER_PORT = int(config.get("AI_SERVER_PORT"))
