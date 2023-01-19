import bson
import pymongo
import os
import flask
import json

from pymongo.collection import Collection, ReturnDocument
from utils import hash_password, hash_file_name
from datetime import datetime, timedelta, timezone

from flask import Flask, request, url_for, jsonify, make_response
from flask_pymongo import PyMongo
from pymongo.errors import DuplicateKeyError

from model import User, RevokeToken, Match, MatchTransaction, Movie, Theatre, MatchRefund, TheatreTransaction, CinemaTransaction, CinemaRefund, TheatreRefund
from objectid import PydanticObjectId

from functools import wraps

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies
from flask_jwt_extended import verify_jwt_in_request

from flask_cors import CORS, cross_origin

from typing import Any

# Configure Flask, Database, JWT:
app = Flask(__name__)
mongodb_url = "mongodb+srv://Alex:"+"@twa.vqdjrmf.mongodb.net/TWAdb?retryWrites=true&w=majority"
database = pymongo.MongoClient(mongodb_url)

# If true this will only allow the cookies that contain your JWTs to be sent
# over https. In production, this should always be set to True
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_SECRET_KEY"] = ""  # Change this in your code!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

CORS(app, supports_credentials=True)

jwt = JWTManager(app)

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["is_administrator"]:
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Admins only!"), 403

        return decorator

    return wrapper

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        claims = get_jwt()
        if target_timestamp > exp_timestamp:
            if claims["is_administrator"]:
                access_token = create_access_token(identity=get_jwt_identity(), additional_claims={"is_administrator": True})
            else:
                access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response

@app.route("/")
def hello_world():
    return "<p>Hello World!</p>"

#region ACCESS ROUTES

## variables for register
# Nume și prenume
# Adresă de email
# Parola
# Tip user

@app.route("/signup", methods=["POST"])
def signup():
    raw_user = request.get_json()
    raw_user["password"] = hash_password(str(raw_user["password"]), str(raw_user["email_address"]))
    raw_user["register_date"] = datetime.utcnow()
    raw_user["user_type"] = "user"

    user_check = database.TWAdb.users.find_one({"email_address": raw_user["email_address"]})

    if not user_check:
        new_user = User(**raw_user)
        insert_result = database.TWAdb.users.insert_one(new_user.to_bson())
        new_user.id = PydanticObjectId(insert_result.inserted_id)

        return make_response('Successfully registered.', 201)
    else:
        # returns 202 if user already exists
        return make_response('User already exists. Please Log in.', 202)

@app.route('/login', methods=['POST'])
def login():
    user = request.get_json()
  
    password_hash = hash_password(str(user["password"]), str(user["email_address"]))

    user_check = database.TWAdb.users.find_one({"email_address": user["email_address"], "password": password_hash})

    if user_check:
        if user_check["user_type"] == "admin":
            response = jsonify({"msg": "login successful"})
            access_token = create_access_token(
                identity=user["email_address"], additional_claims={"is_administrator": True}
            )
            set_access_cookies(response, access_token)
            return response
        else:
            response = jsonify({"msg": "login successful"})
            access_token = create_access_token(
                identity=user["email_address"], additional_claims={"is_administrator": False}
            )
            set_access_cookies(response, access_token)
            return response
    else:
        return jsonify('Bad email or Password'), 401

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

#endregion

#region UTILS

@app.route("/getallusers", methods=["GET"])
@admin_required()
def get_all_users():
    # querying the database
    # for all the entries in it
    users = database.TWAdb.users.find({})
    # converting the query objects
    output = []
    for user in users:
        output.append({
            'first_name' : user["first_name"],
            'last_name' : user["last_name"],
            'email_address' : user["email_address"],
            'password' : user["password"],
            'user_type' : user["user_type"],
            'register_date' : user["register_date"]
        })
  
    return jsonify({'users': output})

#endregion

#region FOR DATABASE ADD EVENTS

@app.route("/insertmatches", methods=["POST"])
def insert_matches():
    matches = request.get_json()
    database.TWAdb.matches.insert_many([
        {
            "date": matches[i]["Date"],
            "team_1": matches[i]["Team 1"],
            "team_2": matches[i]["Team 2"],
            "ticket_price": matches[i]["Ticket price"],
            "number_of_tickets": matches[i]["Number of tickets"]
        } for i in range(200)
    ])
    return make_response('Successfully operation.', 201)

@app.route("/insertmovies", methods=["POST"])
def insert_movies():
    movies = request.get_json()
    database.TWAdb.movies.insert_many([
        {
            "date": movies[i]["date"],
            "film": movies[i]["Film"],
            "genre": movies[i]["Genre"],
            "lead_studio": movies[i]["Lead Studio"],
            "year": movies[i]["Year"],
            "ticket_price": movies[i]["Ticket price"],
            "number_of_tickets": movies[i]["Number of tickets"]
        } for i in range(50)
    ])
    return make_response('Successfully operation.', 201)

@app.route("/insertstandup", methods=["POST"])
def insert_standup():
    return make_response('Not implemented.', 404)

@app.route("/inserttheatre", methods=["POST"])
def insert_theatre():
    theatre = request.get_json()
    database.TWAdb.theatre.insert_many([
        {
            "date": theatre[i]["Date"],
            "name": theatre[i]["Show.Name"],
            "place": theatre[i]["Show.Theatre"],
            "type": theatre[i]["Show.Type"],
            "ticket_price": theatre[i]["Ticket price"],
            "number_of_tickets": theatre[i]["Statistics.Capacity"]
        } for i in range(100)
    ])
    return make_response('Successfully operation.', 201)

#endregion

#region SEE TRANSACTIONS

@app.route("/getalltransactionsmatches", methods=["GET"])
@admin_required()
def get_all_transaction_matches():
    # querying the database
    # for all the entries in it
    matches_transaction = database.TWAdb.matches_transaction.find({})
    # converting the query objects
    output = []
    for tran in matches_transaction:
        output.append({
            'match_id' : tran["match_id"],
            'team_1' : tran["team_1"],
            'team_2' : tran["team_2"],
            'event_date' : tran["event_date"],
            'email' : tran["email"], 
            'tickets_bought' : tran["tickets_bought"]
        })
  
    return jsonify({'match_transactions': output})

@app.route("/getalltransactioncinema", methods=["GET"])
@admin_required()
def get_all_transaction_cinema():
    # querying the database
    # for all the entries in it
    cinema_transaction = database.TWAdb.cinema_transaction.find({})
    # converting the query objects
    output = []
    for tran in cinema_transaction:
        output.append({
            'cinema_id' : tran["cinema_id"],
            'event_date' : tran["event_date"],
            'film' : tran["film"],
            'genre' : tran["genre"],
            'email' : tran["email"], 
            'tickets_bought' : tran["tickets_bought"]
        })
  
    return jsonify({'cinema_transactions': output})

@app.route("/getalltransactiontheatre", methods=["GET"])
@admin_required()
def get_all_transaction_theatre():
    # querying the database
    # for all the entries in it
    theatre_transaction = database.TWAdb.theatre_transaction.find({})
    # converting the query objects
    output = []
    for tran in theatre_transaction:
        output.append({
            'theatre_id' : tran["theatre_id"],
            'name' : tran["name"],
            'event_date' : tran["event_date"],
            'email' : tran["email"],
            'tickets_bought' : tran["tickets_bought"]
        })
  
    return jsonify({'theatre_transactions': output})

#endregion

#region SEE REFUNDS

@app.route("/getallrefundsmatches", methods=["GET"])
@admin_required()
def get_all_refunds_matches():
    matches_refunds = database.TWAdb.matches_refunds.find({})

    output = []
    for r in matches_refunds:
        output.append({
            'match_id' : r["match_id"],
            'email' : r["email"], 
            'tickets_bought' : r["tickets_bought"],
            'status': r["status"]
        })
  
    return jsonify({'match_refunds': output})

@app.route("/getallrefundscinema", methods=["GET"])
@admin_required()
def get_all_refunds_cinema():
    cinema_refunds = database.TWAdb.cinema_refunds.find({})

    output = []
    for c in cinema_refunds:
        output.append({
            'cinema_id' : c["cinema_id"],
            'email' : c["email"], 
            'tickets_bought' : c["tickets_bought"],
            'status': c["status"]
        })
  
    return jsonify({'cinema_refunds': output})

@app.route("/getallrefundstheatre", methods=["GET"])
@admin_required()
def get_all_refunds_theatre():
    theatre_refunds = database.TWAdb.theatre_refunds.find({})

    output = []
    for t in theatre_refunds:
        output.append({
            'theatre_id' : t["theatre_id"],
            'email' : t["email"], 
            'tickets_bought' : t["tickets_bought"],
            'status': t["status"]
        })
  
    return jsonify({'theatre_refunds': output})

#endregion

#region SEE USER TICKETS

@app.route("/getyourmatches", methods=["GET"])
# @jwt_required()
def get_your_matches():
    user_email = request.args.get('email')

    user_matches = database.TWAdb.matches_transaction.find({"email": user_email})

    output = []
    for m in user_matches:
        checker = database.TWAdb.matches_refunds.find_one({"match_id": m["match_id"], "email": user_email})
        if checker != None:
            if checker["status"] == 1:
                output.append({
                    'match_id' : m["match_id"],
                    'team_1' : m["team_1"],
                    'team_2' : m["team_2"],
                    'event_date' : m["event_date"],
                    'email' : m["email"], 
                    'tickets_bought' : m["tickets_bought"]
                })
        else:
            output.append({
                'match_id' : m["match_id"],
                'team_1' : m["team_1"],
                'team_2' : m["team_2"],
                'event_date' : m["event_date"],
                'email' : m["email"], 
                'tickets_bought' : m["tickets_bought"]
            })

    return jsonify({'your_matches': output})

@app.route("/getyourtheatre", methods=["GET"])
# @jwt_required()
def get_your_theatre():
    user_email = request.args.get('email')
    print(user_email)

    user_t = database.TWAdb.theatre_transaction.find({"email": user_email})

    output = []
    for t in user_t:
        checker = database.TWAdb.theatre_refunds.find_one({"theatre_id": t["theatre_id"], "email": user_email})
        if checker != None:
            if checker["status"] == 1:
                output.append({
                    'theatre_id' : t["theatre_id"],
                    'name' : t["name"],
                    'event_date' : t["event_date"],
                    'email' : t["email"],
                    'tickets_bought' : t["tickets_bought"]
                })
        else:
            output.append({
                'theatre_id' : t["theatre_id"],
                'name' : t["name"],
                'event_date' : t["event_date"],
                'email' : t["email"],
                'tickets_bought' : t["tickets_bought"]
            })
  
    return jsonify({'your_theatre_events': output})

@app.route("/getyourcinema", methods=["GET"])
# @jwt_required()
def get_your_cinema():
    user_email = request.args.get('email')

    user_c = database.TWAdb.cinema_transaction.find({"email": user_email})

    output = []
    for c in user_c:
        checker = database.TWAdb.cinema_refunds.find_one({"cinema_id": c["cinema_id"], "email": user_email})
        if checker != None:
            if checker["status"] == 1:
                output.append({
                    'cinema_id' : c["cinema_id"],
                    'event_date' : c["event_date"],
                    'film' : c["film"],
                    'genre' : c["genre"],
                    'email' : c["email"], 
                    'tickets_bought' : c["tickets_bought"]
                })
        else:
            output.append({
                'cinema_id' : c["cinema_id"],
                'event_date' : c["event_date"],
                'film' : c["film"],
                'genre' : c["genre"],
                'email' : c["email"], 
                'tickets_bought' : c["tickets_bought"]
            }) 
  
    return jsonify({'your_cinema_events': output})

#endregion

#region ADD TICKETS

@app.route("/addcinematickets", methods=["POST"])
@admin_required()
def add_cinema_tickets():
    movie = request.get_json()

    find_movie = database.TWAdb.movies.find_one({"date": movie["date"], "film": movie["film"], "genre": movie["genre"], "lead_studio": movie["lead_studio"], "year": movie["year"]})

    if find_movie != None:
        new_number_of_tickets = int(find_movie["number_of_tickets"]) + int(movie["surplus"])
        id_movie = database.TWAdb.movies.find_one_and_update({"date": movie["date"], "film": movie["film"], "genre": movie["genre"], "lead_studio": movie["lead_studio"], "year": movie["year"]},
                            { "$set": { "number_of_tickets": str(new_number_of_tickets) } },
                            return_document = ReturnDocument.AFTER)
        
        return jsonify({
            "date": id_movie["date"],
            "film": id_movie["film"],
            "genre": id_movie["genre"],
            "lead_studio": id_movie["lead_studio"],
            "year": id_movie["year"],
            "ticket_price": id_movie["ticket_price"],
            "number_of_tickets": id_movie["number_of_tickets"]
        })
    else:
        return jsonify({
            "message": "This movie event doesn't exists!"
        })

@app.route("/addtheatretickets", methods=["POST"])
@admin_required()
def add_theatre_tickets():
    theatre = request.get_json()

    find_theatre = database.TWAdb.theatre.find_one({"date": theatre["date"], "name": theatre["name"], "place": theatre["place"], "type": theatre["type"]})

    if find_theatre != None:
        new_number_of_tickets = int(find_theatre["number_of_tickets"]) + int(theatre["surplus"])
        id_theatre = database.TWAdb.theatre.find_one_and_update({"date": theatre["date"], "name": theatre["name"], "place": theatre["place"], "type": theatre["type"]},
                            { "$set": { "number_of_tickets": str(new_number_of_tickets) } },
                            return_document = ReturnDocument.AFTER)
        
        return jsonify({
            "date": id_theatre["date"],
            "name": id_theatre["name"],
            "place": id_theatre["place"],
            "type": id_theatre["type"],
            "ticket_price": id_theatre["ticket_price"],
            "number_of_tickets": id_theatre["number_of_tickets"]
        })
    else:
        return jsonify({
            "message": "This theatre event doesn't exists!"
        })

@app.route("/addstanduptickets", methods=["POST"])
@admin_required()
def add_standup_tickets():
    return make_response('Not implemented.', 404)

@app.route("/addmatchtickets", methods=["POST"])
@admin_required()
def add_match_tickets():
    match = request.get_json()


    find_match = database.TWAdb.matches.find_one({"date": match["date"], "team_1": match["team_1"], "team_2": match["team_2"]})

    if find_match != None:
        new_number_of_tickets = int(find_match["number_of_tickets"]) + int(match["surplus"])
        id_match = database.TWAdb.matches.find_one_and_update({"date": match["date"], "team_1": match["team_1"], "team_2": match["team_2"]},
                            { "$set": { "number_of_tickets": str(new_number_of_tickets) } },
                            return_document = ReturnDocument.AFTER)
        
        return jsonify({
            "date": id_match["date"],
            "team_1": id_match["team_1"],
            "team_2": id_match["team_2"],
            "ticket_price": id_match["ticket_price"],
            "number_of_tickets": id_match["number_of_tickets"]
        })
    else:
        return jsonify({
            "message": "This match event doesn't exists!"
        })

#endregion

#region ADD EVENTS/ADMIN USER

@app.route("/addadminuser", methods=["POST"])
@admin_required()
def add_admin_user():
    raw_admin = request.get_json()
    raw_admin["password"] = hash_password(str(raw_admin["password"]), str(raw_admin["email_address"]))
    raw_admin["register_date"] = datetime.utcnow()
    raw_admin["user_type"] = "admin"

    user_check = database.TWAdb.users.find_one({"email_address": raw_admin["email_address"]})

    if not user_check:
        new_admin_user = User(**raw_admin)
        insert_result = database.TWAdb.users.insert_one(new_admin_user.to_bson())
        new_admin_user.id = PydanticObjectId(insert_result.inserted_id)

        return make_response('Successfully added.', 201)
    else:
        # returns 202 if user already exists
        return make_response("This admin can't be added.", 202)

@app.route("/addcinemaevent", methods=["POST"])
@admin_required()
def add_cinema_event():
    raw_movie = request.get_json()

    check_1 = database.TWAdb.movies.find_one({"date": raw_movie["date"], "film": raw_movie["film"]})

    if not check_1:
        new_movie = Movie(**raw_movie)
        insert_result = database.TWAdb.movies.insert_one(new_movie.to_bson())
        new_movie.id = PydanticObjectId(insert_result.inserted_id)

        return make_response('Successfully added.', 201)
    else:
        # returns 202 if user already exists
        return make_response("This film can't be added in that day.", 202)

@app.route("/addtheatreevent", methods=["POST"])
@admin_required()
def add_theatre_event():
    raw_theatre = request.get_json()

    check_1 = database.TWAdb.theatre.find_one({"date": raw_theatre["date"], "name": raw_theatre["name"]})

    if not check_1:
        new_theatre = Theatre(**raw_theatre)
        insert_result = database.TWAdb.theatre.insert_one(new_theatre.to_bson())
        new_theatre.id = PydanticObjectId(insert_result.inserted_id)

        return make_response('Successfully added.', 201)
    else:
        # returns 202 if user already exists
        return make_response("This theatre event can't be added in that day", 202)

@app.route("/addstandupevent", methods=["POST"])
@admin_required()
def add_standup_event():
    return make_response('Not implemented.', 404)

@app.route("/addmatchevent", methods=["POST"])
@admin_required()
def add_match_event():
    raw_match = request.get_json()

    check_1 = database.TWAdb.matches.find_one({"date": raw_match["date"], "team_1": raw_match["team_1"]})
    check_2 = database.TWAdb.matches.find_one({"date": raw_match["date"], "team_2": raw_match["team_2"]})

    if not check_1 and not check_2:
        new_match = Match(**raw_match)
        insert_result = database.TWAdb.matches.insert_one(new_match.to_bson())
        new_match.id = PydanticObjectId(insert_result.inserted_id)

        return make_response('Successfully added.', 201)
    else:
        # returns 202 if user already exists
        return make_response('One of the teams cant play in that day.', 202)

#endregion

#region DELETE EVENTS/USERS

@app.route("/deleteuser", methods=["POST"])
@admin_required()
def delete_user():
    user_d = request.get_json()

    find_user = database.TWAdb.users.find_one({"first_name": user_d["first_name"], "last_name": user_d["last_name"], "email_address": user_d["email_address"]})

    if find_user != None:
        e = database.TWAdb.matches_refunds.delete_many({"email_address": user_d["email_address"]})
        d = database.TWAdb.matches_transaction.delete_many({"email_address": user_d["email_address"]})
        delete_result = database.TWAdb.users.delete_one({"first_name": user_d["first_name"], "last_name": user_d["last_name"], "email_address": user_d["email_address"]})

        return make_response('Successfully deleted.', 201)
    else:
        return make_response('Operation failed.', 202)

@app.route("/deletecinemaevent", methods=["POST"])
@admin_required()
def delete_cinema_event():
    movie_d = request.get_json()

    find_movie = database.TWAdb.movies.find_one({"date": movie_d["date"], "film": movie_d["film"], "genre": movie_d["genre"], "lead_studio": movie_d["lead_studio"], "year": movie_d["year"]})

    if find_movie != None:
        delete_result = database.TWAdb.movies.delete_one({"date": movie_d["date"], "film": movie_d["film"], "genre": movie_d["genre"], "lead_studio": movie_d["lead_studio"], "year": movie_d["year"]})

        return make_response('Successfully deleted.', 201)
    else:
        return make_response('Operation failed.', 202)

@app.route("/deletetheatreevent", methods=["POST"])
@admin_required()
def delete_theatre_event():
    theatre_d = request.get_json()

    find_theatre = database.TWAdb.theatre.find_one({"date": theatre_d["date"], "name": theatre_d["name"], "place": theatre_d["place"], "type": theatre_d["type"]})

    if find_theatre != None:
        delete_result = database.TWAdb.theatre.delete_one({"date": theatre_d["date"], "name": theatre_d["name"], "place": theatre_d["place"], "type": theatre_d["type"]})

        return make_response('Successfully deleted.', 201)
    else:
        return make_response('Operation failed.', 202)

@app.route("/deletestandupevent", methods=["POST"])
@admin_required()
def delete_standup_event():
    return make_response('Not implemented.', 404)

@app.route("/deletematchevent", methods=["POST"])
@admin_required()
def delete_match_event():
    match_d = request.get_json()

    find_match = database.TWAdb.matches.find_one({"date": match_d["date"], "team_1": match_d["team_1"], "team_2": match_d["team_2"]})

    if find_match != None:
        delete_result = database.TWAdb.matches.delete_one({"date": match_d["date"], "team_1": match_d["team_1"], "team_2": match_d["team_2"]})

        return make_response('Successfully deleted.', 201)
    else:
        return make_response('Operation failed.', 202)

#endregion

#region APROVE TICKET REFUNDS

@app.route("/aprovecinematicketrefund", methods=["POST"])
@admin_required()
def aprove_cinema_ticket_refund():
    cinema_r = request.get_json()

    c_refund = database.TWAdb.cinema_refunds.find_one_and_update({"cinema_id": cinema_r["cinema_id"], "email": cinema_r["email"]},
                        { "$set": { "status": 0 } },
                        return_document = ReturnDocument.AFTER)

    find_movie = database.TWAdb.movies.find_one({"_id": PydanticObjectId(cinema_r["cinema_id"])})

    new_nr_of_tickets = int(find_movie['number_of_tickets']) + int(c_refund['tickets_bought'])
    
    tickets_update = database.TWAdb.movies.find_one_and_update({"_id": PydanticObjectId(cinema_r["cinema_id"])},
                        { "$set": { "number_of_tickets": str(new_nr_of_tickets) } })
    
    return make_response('Refund approved.', 202)

@app.route("/aprovetheatreticketrefund", methods=["POST"])
@admin_required()
def aprove_theatre_ticket_refund():
    theatre_r = request.get_json()

    t_refund = database.TWAdb.theatre_refunds.find_one_and_update({"theatre_id": theatre_r["theatre_id"], "email": theatre_r["email"]},
                        { "$set": { "status": 0 } },
                        return_document = ReturnDocument.AFTER)

    find_theatre = database.TWAdb.theatre.find_one({"_id": PydanticObjectId(theatre_r["theatre_id"])})

    new_nr_of_tickets = int(find_theatre['number_of_tickets']) + int(t_refund['tickets_bought'])
    
    tickets_update = database.TWAdb.theatre.find_one_and_update({"_id": PydanticObjectId(theatre_r["theatre_id"])},
                        { "$set": { "number_of_tickets": str(new_nr_of_tickets) } })
    
    return make_response('Refund approved.', 202)

@app.route("/aprovestandupticketrefund", methods=["POST"])
@admin_required()
def aprove_standup_ticket_refund():
    return make_response('Not implemented.', 404)

@app.route("/aprovematchticketrefund", methods=["POST"])
@admin_required()
def aprove_match_ticket_refund():
    match_r = request.get_json()

    m_refund = database.TWAdb.matches_refunds.find_one_and_update({"match_id": match_r["match_id"], "email": match_r["email"]},
                        { "$set": { "status": 0 } },
                        return_document = ReturnDocument.AFTER)

    find_match = database.TWAdb.matches.find_one({"_id": PydanticObjectId(match_r["match_id"])})

    new_nr_of_tickets = int(find_match['number_of_tickets']) + int(m_refund['tickets_bought'])
    
    tickets_update = database.TWAdb.matches.find_one_and_update({"_id": PydanticObjectId(match_r["match_id"])},
                        { "$set": { "number_of_tickets": str(new_nr_of_tickets) } })
    
    return make_response('Refund approved.', 202)

#endregion

#region SEE EVENTS

## Evenimente
# cinema
# teatru
#TODO standup
# meciuri

@app.route("/getcinemaevents", methods=["GET"])
@jwt_required()
def get_cinema_events():
    movies = database.TWAdb.movies.find({})
    output = []
    for movie in movies:
        output.append({
            'date' : movie["date"],
            'film' : movie["film"],
            'genre' : movie["genre"],
            'lead_studio' : movie["lead_studio"],
            'year' : movie["year"],
            'ticket_price' : movie["ticket_price"],
            'number_of_tickets' : movie["number_of_tickets"]
        })
    response = flask.jsonify({'movies': output})
    return response

@app.route("/gettheatreevents", methods=["GET"])
@jwt_required()
def get_theatre_events():
    theatre_events = database.TWAdb.theatre.find({})
    output = []
    for t in theatre_events:
        output.append({
            'date' : t["date"],
            'name' : t["name"],
            'place' : t["place"],
            'type' : t["type"],
            'ticket_price' : t["ticket_price"],
            'number_of_tickets' : t["number_of_tickets"]
        })
  
    return jsonify({'theatre_events': output})

@app.route("/getstandupevents", methods=["GET"])
@jwt_required()
def get_standup_events():
    return jsonify(foo="bar")

@app.route("/getmatchevents", methods=["GET"])
@jwt_required()
def get_match_events():
    matches = database.TWAdb.matches.find({})
    output = []
    for match in matches:
        output.append({
            'date' : match["date"],
            'team_1' : match["team_1"],
            'team_2' : match["team_2"],
            'ticket_price' : match["ticket_price"],
            'number_of_tickets' : match["number_of_tickets"]
        })
  
    return jsonify({'matches': output})

#endregion

#region GET TICKETS FOR EVENTS

@app.route("/getcinematicket", methods=["GET"])
@jwt_required()
def get_cinema_ticket():
    cinema = request.args

    user_email = cinema.get("user_email")

    find_cinema = database.TWAdb.movies.find_one({"date": cinema.get("date"), "film": cinema.get("film")})
    convert_id_movie = str(find_cinema.get('_id'))

    if int(find_cinema["number_of_tickets"]) >= int(cinema.get("requested_tickets")):
        check_1 = database.TWAdb.cinema_transaction.find_one({
            "cinema_id": convert_id_movie,
            "date": find_cinema["date"],
            "film": find_cinema["film"],
            "genre": find_cinema["genre"],
            "email": user_email,
            "tickets_bought": cinema.get("requested_tickets")
        })

        if not check_1:
            new_number_of_tickets = int(find_cinema["number_of_tickets"]) - int(cinema.get("requested_tickets"))

            c = database.TWAdb.movies.find_one_and_update({"date": cinema.get("date"), "film": cinema.get("film")},
                                { "$set": { "number_of_tickets": str(new_number_of_tickets) } })

            cinema_transaction = {
                "cinema_id": convert_id_movie,
                "event_date": c["date"],
                "film": c["film"],
                "genre": c["genre"],
                "email": user_email,
                "tickets_bought": cinema.get("requested_tickets")
            }

            new_cinema_transaction = CinemaTransaction(**cinema_transaction)
            insert_result = database.TWAdb.cinema_transaction.insert_one(new_cinema_transaction.to_bson())
            new_cinema_transaction.id = PydanticObjectId(insert_result.inserted_id)
    
            return make_response('Successfully operation.', 201)
        else:
            return make_response('You already have tickets for this event.', 202)
    else:
        return make_response('No tickets available.', 202)

@app.route("/gettheatreticket", methods=["GET"])
@jwt_required()
def get_theatre_ticket():
    theatre = request.args

    user_email = theatre.get("user_email")

    find_theatre = database.TWAdb.theatre.find_one({"date": theatre.get("date"), "name": theatre.get("name")})
    convert_id_theatre = str(find_theatre.get('_id'))

    if int(find_theatre["number_of_tickets"]) >= int(theatre.get("requested_tickets")):
        check_1 = database.TWAdb.theatre_transaction.find_one({
            "theatre_id": convert_id_theatre,
            "name": find_theatre["name"],
            "email": user_email,
            "tickets_bought": theatre.get("requested_tickets")
        })

        if not check_1:
            new_number_of_tickets = int(find_theatre["number_of_tickets"]) - int(theatre.get("requested_tickets"))

            t = database.TWAdb.theatre.find_one_and_update({"date": theatre.get("date"), "name": theatre.get("name")},
                                { "$set": { "number_of_tickets": str(new_number_of_tickets) } })

            theatre_transaction = {
                "theatre_id": convert_id_theatre,
                "name": t["name"],
                "event_date": t["date"],
                "email": user_email,
                "tickets_bought": theatre.get("requested_tickets")
            }

            new_theatre_transaction = TheatreTransaction(**theatre_transaction)
            insert_result = database.TWAdb.theatre_transaction.insert_one(new_theatre_transaction.to_bson())
            new_theatre_transaction.id = PydanticObjectId(insert_result.inserted_id)
    
            return make_response('Successfully operation.', 201)
        else:
            return make_response('You already have tickets for this event.', 202)
    else:
        return make_response('No tickets available.', 202)

@app.route("/getstandupticket", methods=["GET"])
@jwt_required()
def get_standup_ticket():
    return make_response('Not implemented.', 404)

@app.route("/getmatchticket", methods=["GET"])
@jwt_required()
def get_match_ticket():
    match = request.args

    user_email = match.get("user_email")

    find_match = database.TWAdb.matches.find_one({"date": match.get("date"), "team_1": match.get("team_1"), "team_2": match.get("team_2")})
    convert_id_match = str(find_match.get('_id'))

    if int(find_match["number_of_tickets"]) >= int(match.get("requested_tickets")):
        check_1 = database.TWAdb.matches_transaction.find_one({
            "match_id": convert_id_match,
            "team_1": find_match["team_1"],
            "team_2": find_match["team_2"],
            "event_date": find_match["date"],
            "email": user_email,
            "tickets_bought": match.get("requested_tickets")
        })

        if not check_1:
            new_number_of_tickets = int(find_match["number_of_tickets"]) - int(match.get("requested_tickets"))

            id_match = database.TWAdb.matches.find_one_and_update({"date": match["date"], "team_1": match["team_1"], "team_2": match["team_2"]},
                                { "$set": { "number_of_tickets": str(new_number_of_tickets) } })

            match_transaction = {
                "match_id": convert_id_match,
                "team_1": id_match["team_1"],
                "team_2": id_match["team_2"],
                "event_date": id_match["date"],
                "email": user_email,
                "tickets_bought": match.get("requested_tickets")
            }

            new_match_transaction = MatchTransaction(**match_transaction)
            insert_result = database.TWAdb.matches_transaction.insert_one(new_match_transaction.to_bson())
            new_match_transaction.id = PydanticObjectId(insert_result.inserted_id)
    
            return make_response('Successfully operation.', 201)
        else:
            return make_response('You already have tickets for this event.', 202)
    else:
        return make_response('No tickets available.', 202)

#endregion

#region REFUND TICKET

@app.route("/refundcinematicket", methods=["POST"])
@jwt_required()
def refund_cinema_ticket():
    cinema_ticket = request.get_json()

    cinema_refund= {
        "cinema_id": cinema_ticket["cinema_id"],
        "email": cinema_ticket["email"],
        "tickets_bought": cinema_ticket["tickets_bought"],
        "status": 1
    }

    new_cinema_refund = CinemaRefund(**cinema_refund)
    insert_result = database.TWAdb.cinema_refunds.insert_one(new_cinema_refund.to_bson())
    new_cinema_refund.id = PydanticObjectId(insert_result.inserted_id)

    return make_response('Refund sent.', 202)

@app.route("/refundtheatreticket", methods=["POST"])
@jwt_required()
def refund_theatre_ticket():
    theatre_ticket = request.get_json()

    theatre_refund= {
        "theatre_id": theatre_ticket["theatre_id"],
        "email": theatre_ticket["email"],
        "tickets_bought": theatre_ticket["tickets_bought"],
        "status": 1
    }

    new_theatre_refund = TheatreRefund(**theatre_refund)
    insert_result = database.TWAdb.theatre_refunds.insert_one(new_theatre_refund.to_bson())
    new_theatre_refund.id = PydanticObjectId(insert_result.inserted_id)

    return make_response('Refund sent.', 202)

@app.route("/refundstandupticket", methods=["POST"])
@jwt_required()
def refund_standup_ticket():
    return make_response('Not implemented.', 404)

@app.route("/refundmatchticket", methods=["POST"])
@jwt_required()
def refund_match_ticket():
    match_ticket = request.get_json()

    match_refund= {
        "match_id": match_ticket["match_id"],
        "email": match_ticket["email"],
        "tickets_bought": match_ticket["tickets_bought"],
        "status": 1
    }

    new_match_refund = MatchRefund(**match_refund)
    insert_result = database.TWAdb.matches_refunds.insert_one(new_match_refund.to_bson())
    new_match_refund.id = PydanticObjectId(insert_result.inserted_id)

    return make_response('Refund sent.', 202)

#endregion

if __name__ == "__main__":
    app.run()