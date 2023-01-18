from fastapi.encoders import jsonable_encoder

# Pydantic, and Python's built-in typing are used to define a schema
# that defines the structure and types of the different objects stored
# in the recipes collection, and managed by this API.
from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime
from objectid import PydanticObjectId

import bson

# Nume și prenume
# Adresă de email
# Parola
# Register date

class User(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    first_name: str
    last_name: str
    email_address: str
    password: str
    user_type: str
    register_date: Optional[datetime]

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class Match(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    date: str
    team_1: str
    team_2: str
    ticket_price: str
    number_of_tickets: str

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class Movie(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    date: str
    film: str
    genre: str
    lead_studio: str
    year: str
    ticket_price: str
    number_of_tickets: str

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class Theatre(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    date: str
    name: str
    place: str
    type: str
    ticket_price: str
    number_of_tickets: str

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data

class MatchTransaction(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    match_id: str
    team_1: str
    team_2: str
    event_date: str
    email: str
    tickets_bought: str

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class CinemaTransaction(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    cinema_id: str
    event_date: str
    film: str
    genre: str
    email: str
    tickets_bought: str

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class TheatreTransaction(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    theatre_id: str
    name: str
    event_date: str
    email: str
    tickets_bought: str

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class MatchRefund(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    match_id: str
    email: str
    tickets_bought: str
    status: int

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class CinemaRefund(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    cinema_id: str
    email: str
    tickets_bought: str
    status: int

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 

class TheatreRefund(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    theatre_id: str
    email: str
    tickets_bought: str
    status: int

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data 


# jti
# created_at

class RevokeToken(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    jti: str
    created_at: Optional[datetime]

    def to_json(self):
        return jsonable_encoder(self, exclude_none=True)

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data
