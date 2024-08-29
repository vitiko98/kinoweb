import pytest

from kinorest import dummy


@pytest.fixture
def sample_path():
    return "samples/001.yml"


def test_dummy_media(sample_path):
    assert dummy.media(sample_path, "taxi")[0].title == "Taxi Driver"
    assert dummy.media(sample_path, "parasite")[0].title == "Parasite"
    assert dummy.media(sample_path, "doesn't exist!") == []


def test_dummy_suggestions(sample_path):
    assert dummy.suggestions(sample_path, "103", "you talking")[0].quote == "You talking to me?"
    assert dummy.suggestions(sample_path, "104", "parasite")[0].quote == "Parasite quote"
    assert dummy.suggestions(sample_path, "1020301", "parasite") == []


def test_dummy_frame(sample_path):
    assert dummy.frame(sample_path, "103", 100)
    assert dummy.frame(sample_path, "104", 100)
    assert not dummy.frame(sample_path, "10329102309214", 100)
