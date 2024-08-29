" These are dummy services for testing and development purposes "
import logging

import yaml

from kinorest import rest

logger = logging.getLogger(__name__)


def _get_sample_data(path):
    with open(path, "r") as f:
        return yaml.safe_load(f)


def media(
    _data_path: str,
    q: str,
    limit: int = 10,
    offset: int = 0,
):
    data = _get_sample_data(_data_path)["media"]
    results = []
    for item in data:
        if q.lower() in item["title"].lower():
            results.append(rest.Media.model_validate(item))

    return results


def suggestions(
    _data_path: str,
    id: str,
    q: str,
    limit: int = 10,
    offset: int = 0,
):
    data = _get_sample_data(_data_path)["bracket_suggestions"]
    try:
        suggestions_ = data[id]
    except KeyError as error:
        logger.debug(error, exc_info=True)
        return []

    results = []

    for item in suggestions_:
        if q.lower() in (item["quote"] or "").lower():
            results.append(rest.BracketSuggestion.model_validate(item))

    return results


def frame(
    _data_path: str,
    id: str,
    ms: int,
    type: str = "png",
):
    data = _get_sample_data(_data_path)["frame_responses"]
    try:
        frame = data[id]
    except KeyError as error:
        logger.debug(error, exc_info=True)
        return None

    return rest.FrameResponse.model_validate(frame)
