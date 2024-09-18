import requests

from kinorest import rest


def _parsemedia(item):
    return rest.Media(
        id=item["id"],
        type=item["type"],
        uri=f'{item["type"]}:{item["id"]}',
        title=item["pretty_title"],
        backdrop=item["backdrop"],
        proximity=100,
        poster=None,
        external_link=None,
    )


def _parsebracket(media_id, item):
    return rest.BracketSuggestion(
        media_id=media_id,
        quote=item["subtitle_quote"],
        timestamp=int(item["subtitle_timestamp"] or 0),
    )


class Client:
    def __init__(self, host: str, api_key: str) -> None:
        self._host = host
        self._api_key = api_key

    def mediasearch(self, query):
        params = {"query": query, "api_key": self._api_key}
        response = requests.get(f"{self._host}/mediasearch", params=params)
        return [_parsemedia(i) for i in response.json()]

    def bracket(self, media_id, query):
        params = {"id": media_id, "query": query, "api_key": self._api_key}
        response = requests.get(f"{self._host}/bracket", params=params)
        return [_parsebracket(media_id, i) for i in response.json()]

    def request(self, query):
        params = {"content": query, "api_key": self._api_key}
        response = requests.get(f"{self._host}/request", params=params).json()
        return rest.FrameResponse(url=response["image_uris"][0])
