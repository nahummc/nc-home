from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    print("Hello World")
    return render_template('index.html')

@app.route('/sudoku')
def sudoku():
    return render_template('sudoku.html')  

if __name__ == '__main__':
    app.run(debug=True)
