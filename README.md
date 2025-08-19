# AI Document Q&A System

A sophisticated AI agent system that can read and answer questions from documents using RAG (Retrieval-Augmented Generation). Built with LangChain, LangGraph, and modern AI technologies.

## 🚀 Features

- **Document Processing**: Upload and process PDF documents for Q&A
- **AI Agent Flow**: Intelligent agent workflow using LangChain and LangGraph
- **Vector Storage**: ChromaDB for efficient document vector storage
- **Long-term Memory**: Mem0 and Qdrant for persistent memory storage
- **Modern UI**: Beautiful Next.js frontend with Tailwind CSS
- **FastAPI Backend**: Robust Python backend with FastAPI

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Qdrant DB     │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Memory)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   ChromaDB      │
                       │ (Vector Store)  │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18+ (for Frontend)
- **Python** 3.13+ (for Backend)
- **Docker** & **Docker Compose** (for Qdrant)
- **OpenAI API Key** (for AI capabilities)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI-document-Q&A
```

### 2. Frontend Setup

```bash
cd Frontend

# Install dependencies using npm
npm install

# Or if you prefer pnpm (recommended)
npm install -g pnpm
pnpm install
```

### 3. Backend Setup

```bash
cd Backend

# Install uv (Python package manager)
pip install uv

# Install dependencies
uv sync

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 4. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Memory Configuration
INCLUDE_MEMORY=False  # Set to false to disable long-term memory
MEMORY_PROVIDER = qdrant #required if True
PROVIDER_HOST = localhost #required if True
PROVIDER_PORT = 6333 #required if True
```

## 🐳 Docker Setup (Required for Long-term Memory)

### Start Qdrant Database

If you want to use long-term memory features with Mem0, you need to start the Qdrant database:

```bash
# Start Qdrant using Docker Compose
docker-compose up -d qdrant

# Verify Qdrant is running
docker-compose ps
```

**Important**: The Qdrant service must be running for the long-term memory features to work properly.

### Access Qdrant Dashboard

- **Qdrant Dashboard**: http://localhost:6333/dashboard
- **Qdrant API**: http://localhost:6333

## 🚀 Running the Application

### Development Mode

#### 1. Start Backend

```bash
cd Backend
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
#or
python main.py
```

#### 2. Start Frontend

```bash
cd Frontend
npm run dev
# Or with pnpm: pnpm run dev
```

#### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

### Production Mode with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

## 📚 Usage

### 1. Document Upload

1. Navigate to the application
2. Click "Upload Document" or drag & drop a PDF file
3. Wait for the document to be processed and indexed

### 2. Ask Questions

1. Type your question in the chat interface
2. The AI agent will:
   - Search through your uploaded documents
   - Retrieve relevant information
   - Generate a comprehensive answer
   - Store the interaction in memory (if enabled)

### 3. Memory Features

With `INCLUDE_MEMORY_WITH_MEM0=true`:
- The system remembers previous conversations
- Provides context-aware responses
- Maintains conversation history across sessions

## 🔧 Configuration Options

### Backend Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | - | ✅ |
| `INCLUDE_MEMORY` | Enable long-term memory | `true` | ❌ |

## 🏗️ Project Structure

```
AI-document-Q&A/
├── Frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility libraries
│   ├── styles/              # CSS and styling
│   └── public/              # Static assets
├── Backend/                 # FastAPI backend application
│   ├── app/                 # Application modules
│   ├── data/                # Data storage
│   ├── documents/           # Uploaded documents
│   └── main.py              # FastAPI application entry
├── compose.yml              # Docker Compose configuration
└── README.md                # This file
```

## 🔍 API Endpoints

### Backend API

- `POST /api/agent` - Send a message to the AI agent
- `POST /api/agent/document` - Upload and process a document with a question
- `GET /docs` - Interactive API documentation (Swagger UI)

### Request Examples

#### Send a Message
```bash
curl -X POST "http://localhost:8000/api/agent" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the main topic of the document?"}'
```

#### Upload Document with Question
```bash
curl -X POST "http://localhost:8000/api/agent/document" \
  -F "file=@document.pdf" \
  -F "message=Summarize this document"
```

## 🐛 Troubleshooting

### Common Issues

1. **Qdrant Connection Error**
   - Ensure Qdrant is running: `docker-compose ps`
   - Check Qdrant logs: `docker-compose logs qdrant`

2. **OpenAI API Errors**
   - Verify your API key is correct
   - Check your OpenAI account balance
   - Ensure the API key has proper permissions

3. **Document Processing Issues**
   - Ensure documents are in PDF format
   - Check file size limits
   - Verify ChromaDB is working properly

4. **Memory Not Working**
   - Ensure `INCLUDE_MEMORY_WITH_MEM0=true` in backend `.env`
   - Verify Qdrant is running and accessible
   - Check backend logs for memory-related errors

### Logs and Debugging

```bash
# Backend logs
cd Backend
uv run uvicorn main:app --log-level debug

# Frontend logs
cd Frontend
npm run dev

# Docker logs
docker-compose logs -f
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) - AI application framework
- [LangGraph](https://langchain.com/langgraph) - Stateful AI workflows
- [ChromaDB](https://www.trychroma.com/) - Vector database
- [Mem0](https://mem0.ai/) - Long-term memory for AI
- [Qdrant](https://qdrant.tech/) - Vector similarity search engine
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
