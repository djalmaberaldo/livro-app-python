
from flask import Flask, request, jsonify, g, Response, render_template
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import json
import os

# Init app
app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)
# Init ma
ma = Marshmallow(app)

# book Class/Model
class Book(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  author = db.Column(db.String(100))
  title = db.Column(db.String(200))

  def __init__(self, author, title):
    self.author = author
    self.title = title

# book Schema
class bookSchema(ma.Schema):
  class Meta:
    fields = ('id', 'author', 'title')

# Init schema
book_schema = bookSchema(strict=True)
books_schema = bookSchema(many=True, strict=True)

# Create a book
@app.route('/book', methods=['POST'])
def add_book():
  author = request.json['author']
  title = request.json['title']

  new_book = Book(author, title)

  db.session.add(new_book)
  db.session.commit()

  return book_schema.jsonify(new_book)

# Get All books
@app.route('/book', methods=['GET'])
def get_books():
  all_books = Book.query.all()
  result = books_schema.dump(all_books)
  return jsonify(result.data)

# Get Single books
@app.route('/book/<id>', methods=['GET'])
def get_book(id):
  book = book.query.get(id)
  return book_schema.jsonify(book)

# Update a book
@app.route('/book/<id>', methods=['PUT'])
def update_book(id):
  book = book.query.get(id)

  author = request.json['author']
  title = request.json['title']

  book.author = author
  book.title = title

  db.session.commit()

  return book_schema.jsonify(book)

# Delete book
@app.route('/book/<id>', methods=['DELETE'])
def delete_book(id):
  book = book.query.get(id)
  db.session.delete(book)
  db.session.commit()

  return book_schema.jsonify(book)

if __name__ == "__main__":
    app.run(debug=True)