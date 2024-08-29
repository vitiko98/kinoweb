from fastapi.testclient import TestClient
from kinorest import rest
from kinorest import dummy


client = TestClient(rest.app)


def _media(q, limit, offset):
    return dummy.media("samples/001.yml", q, limit, offset)


def _bracket_suggestion(id, q, limit, offset):
    return dummy.suggestions("samples/001.yml", id, q, limit, offset)


def _frame(id, ms, type="png"):
    return dummy.frame("samples/001.yml", id, ms, type)


rest.app.dependency_overrides[rest.media_service] = _media
rest.app.dependency_overrides[rest.suggestions_service] = _bracket_suggestion
rest.app.dependency_overrides[rest.frame_service] = _frame


def test_media():
    response = client.get("/media", params={"q": "taxi", "limit": 10, "offset": 0})
    assert response.status_code == 200
    assert response.json()[0]["id"] == "103"

    response = client.get(
        "/media", params={"q": "doesn't exist!", "limit": 10, "offset": 0}
    )
    assert response.status_code == 200
    assert response.json() == []


def test_bracket():
    response = client.get(
        "/media/103/suggestions", params={"q": "talking", "limit": 10, "offset": 0}
    )
    assert response.status_code == 200
    assert response.json()[0]["quote"] == "You talking to me?"

def test_frame():
    response = client.get(
        "/media/103/frame", params={"ms": 10000, "type": "png"}
    )
    assert response.status_code == 200
