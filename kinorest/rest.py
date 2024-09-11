from typing import Annotated, Callable, List, Optional

from fastapi import Depends
from fastapi import FastAPI
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
import pydantic

app = FastAPI()

origins = [
    "http://localhost",
    "http://127.0.0.1:5000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Media(pydantic.BaseModel):
    id: str
    type: str
    uri: str
    title: str
    poster: Optional[str]
    backdrop: Optional[str]
    external_link: Optional[str]
    proximity: int


class BracketSuggestion(pydantic.BaseModel):
    media_id: str
    timestamp: int
    quote: Optional[str] = None


class FrameResponse(pydantic.BaseModel):
    url: str


def suggestions_service():
    raise NotImplementedError


def frame_service():
    raise NotImplementedError


def media_service():
    raise NotImplementedError


@app.get("/media")
async def media(
    q: Annotated[
        str, Query(max_length=100, min_length=2, description="The search query.")
    ],
    limit: int = 10,
    offset: int = 0,
    _service=Depends(media_service),
) -> List[Media]:
    "Returns a list of movies, episodes, etc.; ideally in relevance order."
    return _service


@app.get("/media/{id}/suggestions")
async def suggestions(
    id: str,
    q: Annotated[
        str | None, Query(max_length=100, min_length=2, description="The search query.")
    ],
    limit: int = 10,
    offset: int = 0,
    _service=Depends(suggestions_service),
) -> List[BracketSuggestion]:
    'Returns a list of suggestions of "brackets" for the media item.'
    return _service


@app.get("/media/{id}/frame")
async def frame(
    id: str,
    ms: int,
    type: Annotated[str, Query()] = "png",
    _service=Depends(frame_service),
) -> FrameResponse:
    "Returns a frame with a given timestamp in milliseconds."
    return _service
