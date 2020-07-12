from flask import Flask, render_template, jsonify

from flask_socketio import SocketIO, emit
import rsa
import binascii

app = Flask(__name__)
socketio = SocketIO(app)

current_users = []

def keyrequest(name="anonymous"):
    (public_ref,private_ref) = rsa.newkeys(512)
    public = public_ref._save_pkcs1_pem().decode("utf-8").split("\n")[1]
    private = private_ref._save_pkcs1_pem().decode("utf-8").split("\n")[1]
    

    payload = {
        "public":public,
        "private":private,
        "username":name
    }

    user = {
        "pub_reference":public_ref,
        "priv_reference": private_ref,
        "private": private,
        "user": public,
        "name": name
    }
    current_users.append(user)

    return payload

def find_user(userpublicpem):
    return list(filter(lambda x: x["user"],current_users))[0]

def find_key(userprivatepem):
    return list(filter(lambda x: x["private"],current_users))[0]

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("connect")
def socket_connection():
    print("new connection")

@socketio.on("disconnect")
def socket_disconnection(data):
    print(data)
    print("a user disconnected")

@socketio.on("newkeys")
def socket_newkeys():
    emit("newkeys",keyrequest(), json=True)

@socketio.on("decrypt")
def socket_decrypt(data):
    try:
        msg = data["msg"]
        binary = binascii.a2b_base64(msg)
        privkey = find_key(data["private"])["priv_reference"]
        decrypted = rsa.decrypt(binary,privkey).decode("utf-8")
        emit("decryptedSuccess",{"message":decrypted})
    except:
        emit("decryptedFailure")


@socketio.on("message")
def socket_message(data):

    try:
        recipient = find_user(data["to"])
        textset_msg = data["msg"].encode("utf-8")
   
        enc_msg = rsa.encrypt(textset_msg,recipient["pub_reference"])
        ascii_msg = binascii.b2a_base64(enc_msg).decode("utf-8")

        payload = {
            "message":ascii_msg,
            "to":data["to"],
            "sender":data['sender']
        }

        # print(data["msg"])
        emit("newmessage",payload, broadcast=True)

    except:

        emit("messageError")


if __name__ == "__main__":
    socketio.run(app, 
    #host="0.0.0.0", 
    debug=True)