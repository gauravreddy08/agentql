# AgentQL

AgentQL is an intelligent web data extraction tool that allows you to query websites using natural language and extract structured data.

## Features

- **Natural Language Queries**: Define what data you want to extract using simple, intuitive syntax
- **Intelligent Web Scraping**: Automatically scrapes web pages and extracts the requested information
- **Real-time Preview**: See the webpage content alongside your extracted data
- **Modern UI**: Clean, responsive interface with dark theme for code editing and light theme for content preview

## Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Playwright browsers:
```bash
playwright install
```

4. Set up your OpenAI API key:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend API Server

From the root directory:
```bash
python api_server.py
```

The API server will start on `http://localhost:8000`

### Start the Frontend Development Server

From the frontend directory:
```bash
npm start
```

The React app will start on `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Enter a URL in the left panel
3. Define your query schema in the text area (e.g., `{ job_categories[] jobs[] { company_name role } }`)
4. Click "Fetch Data" to extract the information
5. View the extracted data in JSON format on the left and the webpage preview on the right

## API Endpoints

- `POST /api/query` - Generate JSON schema from natural language query
- `POST /api/extract` - Extract data from a webpage using a schema
- `GET /api/health` - Health check endpoint

## Query Syntax

The query syntax is simple and intuitive:

```json
{
  "job_categories[]",
  "jobs[]": {
    "company_name",
    "role",
    "location"
  }
}
```

This will extract:
- An array of job categories
- An array of jobs, each containing company name, role, and location

## Architecture

- **Backend**: Python Flask API with OpenAI integration and Playwright for web scraping
- **Frontend**: React.js with modern UI components
- **Agents**: Specialized agents for query parsing and data extraction
- **Scraping**: Robust web scraping with anti-detection measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
