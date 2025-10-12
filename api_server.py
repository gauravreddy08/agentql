from flask import Flask, request, jsonify
from flask_cors import CORS
from src.agents.query import Agent as QueryAgent
from src.agents.extract import Agent as ExtractAgent
from src.scrape import scrape_webpage
from src.screenshot import take_screenshot
import json
import traceback

app = Flask(__name__)
CORS(app)

# Initialize agents
query_agent = QueryAgent()
extract_agent = ExtractAgent()

@app.route('/api/query', methods=['POST'])
def generate_schema():
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        schema = query_agent.generate(query)
        return jsonify({'schema': schema})
    
    except Exception as e:
        print(f"Error in generate_schema: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/scrape', methods=['POST'])
def scrape_content():
    """Pre-scrape webpage content for caching on frontend."""
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Scrape the webpage
        scrape_result = scrape_webpage(url)
        
        if not scrape_result['success']:
            return jsonify({'error': f"Failed to scrape webpage: {scrape_result['error']}"}), 500
        
        return jsonify(scrape_result)
    
    except Exception as e:
        print(f"Error in scrape_content: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/extract', methods=['POST'])
def extract_data():
    try:
        data = request.get_json()
        url = data.get('url', '')
        schema = data.get('schema', '')
        preloaded_content = data.get('preloaded_content', None)
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        if not schema:
            return jsonify({'error': 'Schema is required'}), 400
        
        # Step 1: Generate JSON schema from query
        json_schema = query_agent.generate(schema)
        
        # Step 2: Get webpage content (use preloaded or scrape fresh)
        if preloaded_content and preloaded_content.get('success'):
            scrape_result = preloaded_content
        else:
            scrape_result = scrape_webpage(url)
        
        if not scrape_result['success']:
            return jsonify({'error': f"Failed to scrape webpage: {scrape_result['error']}"}), 500
        
        # Step 3: Extract data using the schema
        extract_result = extract_agent.generate(scrape_result['content'], json_schema)
        
        return jsonify(extract_result)
    
    except Exception as e:
        print(f"Error in extract_data: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/screenshot', methods=['POST'])
def get_screenshot():
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Take screenshot using the screenshot module
        screenshot_result = take_screenshot(url)
        
        if not screenshot_result['success']:
            return jsonify({'error': f"Failed to take screenshot: {screenshot_result['error']}"}), 500
        
        return jsonify({'screenshot': screenshot_result['screenshot']})
    
    except Exception as e:
        print(f"Error in get_screenshot: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_ENV') == 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
