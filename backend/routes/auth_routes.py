import os
import re

import requests as http
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from models import db, User

auth_bp = Blueprint("auth", __name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID", "")


def issue_token(user):
    token = create_access_token(identity=user.id)
    return {"token": token, "user": user.to_dict()}


# ---------------------------------------------------------------------------
# Email + password
# ---------------------------------------------------------------------------

@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or len(name) < 2:
        return jsonify({"error": "Please enter your full name."}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with that email already exists."}), 409

    user = User(name=name, email=email, provider="email")
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify(issue_token(user)), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    return jsonify(issue_token(user)), 200


# ---------------------------------------------------------------------------
# Google Sign-In
# ---------------------------------------------------------------------------
# The frontend uses Google Identity Services to get an ID token, then sends
# it here. We verify the signature/audience server-side before trusting it.

@auth_bp.post("/google")
def google_auth():
    data = request.get_json(silent=True) or {}
    credential = data.get("credential")

    if not credential:
        return jsonify({"error": "Missing Google credential."}), 400
    if not GOOGLE_CLIENT_ID:
        return jsonify({"error": "Server is missing GOOGLE_CLIENT_ID."}), 500

    try:
        payload = id_token.verify_oauth2_token(
            credential, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        return jsonify({"error": "Invalid or expired Google token."}), 401

    email = (payload.get("email") or "").lower()
    if not email:
        return jsonify({"error": "Google account has no email."}), 400

    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User(
            name=payload.get("name") or email.split("@")[0],
            email=email,
            provider="google",
            avatar_url=payload.get("picture"),
        )
        db.session.add(user)
        db.session.commit()

    return jsonify(issue_token(user)), 200


# ---------------------------------------------------------------------------
# Facebook Login
# ---------------------------------------------------------------------------
# The frontend uses the Facebook JS SDK to get a short-lived access token,
# then sends it here. We verify it against Facebook's Graph API before
# trusting anything it claims.

@auth_bp.post("/facebook")
def facebook_auth():
    data = request.get_json(silent=True) or {}
    access_token = data.get("accessToken")

    if not access_token:
        return jsonify({"error": "Missing Facebook access token."}), 400

    try:
        resp = http.get(
            "https://graph.facebook.com/me",
            params={
                "fields": "id,name,email,picture.type(large)",
                "access_token": access_token,
            },
            timeout=8,
        )
        payload = resp.json()
    except http.RequestException:
        return jsonify({"error": "Could not reach Facebook."}), 502

    if "error" in payload:
        return jsonify({"error": "Invalid Facebook access token."}), 401

    email = (payload.get("email") or "").lower()
    if not email:
        # Some Facebook accounts have no verified email
        email = f"fb_{payload['id']}@no-email.facebook.com"

    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User(
            name=payload.get("name") or "Facebook User",
            email=email,
            provider="facebook",
            avatar_url=(payload.get("picture") or {}).get("data", {}).get("url"),
        )
        db.session.add(user)
        db.session.commit()

    return jsonify(issue_token(user)), 200


# ---------------------------------------------------------------------------
# Current user
# ---------------------------------------------------------------------------

@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify(user.to_dict()), 200
