from flask import Flask, render_template, jsonify

from flask_socketio import SocketIO, emit
import rsa


app = Flask(__name__)
socketio = SocketIO(app)



def keyrequest():
    (public,private) = rsa.newkeys(512)
    public = public._save_pkcs1_pem().decode("utf-8").split("\n")[1]
    private = private._save_pkcs1_pem.decode("utf-8").split("\n")[1]
    
    return {
        "public":public,
        "private":private
    }


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connect")
def socket_connection():
    print("new connection")

@socketio.on("newkeys")
def socket_newkeys():
    emit("newkeys",keyrequest(), json=True)



if __name__ == "__main__":
    socketio.run(app)