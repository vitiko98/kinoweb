from kinorest import dummy
from kinorest import rest


def _media(q, limit, offset):
    return dummy.media("samples/001.yml", q, limit, offset)


def _bracket_suggestion(id, q, limit, offset):
    return dummy.suggestions("samples/001.yml", id, q, limit, offset)


def _frame(id, ms, type="png"):
    return dummy.frame("samples/001.yml", id, ms, type)


rest.app.dependency_overrides[rest.media_service] = _media
rest.app.dependency_overrides[rest.suggestions_service] = _bracket_suggestion
rest.app.dependency_overrides[rest.frame_service] = _frame

import uvicorn

if __name__ == "__main__":
    uvicorn.run(rest.app, port=5000, log_level="info")
