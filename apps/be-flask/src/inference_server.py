from flask import Flask, request, jsonify
from chatbot import LLM
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

llm = LLM()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'success': False, 'error': 'No message provided'}), 400
    user_message = data['message']
    try:
        response = llm.inference(user_message)
        return jsonify({'success': True, 'response': response})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 