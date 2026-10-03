#!/bin/bash

# NISER Local Development Environment Setup Script
# This script sets up everything needed to test NISER locally before deploying to InterServer
# Usage: bash setup-local-dev.sh

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    fi
    print_success "Docker is installed"

    # Check Docker Compose
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    print_success "Docker Compose is installed"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v22 or higher."
        exit 1
    fi
    NODE_VERSION=$(node -v)
    REQUIRED_MAJOR=22
    NODE_MAJOR=$(node -v | sed 's/^v\([0-9][0-9]*\).*/\1/')
    if [ "$NODE_MAJOR" -lt "$REQUIRED_MAJOR" ]; then
        print_error "Node.js v22 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
    print_success "Node.js is installed ($NODE_VERSION)"

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    print_success "npm is installed"

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Setup environment files
setup_env_files() {
    print_header "Setting Up Environment Files"

    if [ ! -f .env.local ]; then
        print_warning ".env.local not found, creating from template"
        touch .env.local
        print_info "Created .env.local — you may need to add API keys manually"
    else
        print_success ".env.local already exists"
    fi

    # Ensure Qdrant URL uses localhost for local dev
    if grep -q "QDRANT_URL=http://localhost:6333" .env.local; then
        print_success "Qdrant URL configured for local development"
    else
        print_info "Updating Qdrant URL for local development"
        sed -i.bak 's|QDRANT_URL=.*|QDRANT_URL=http://localhost:6333|g' .env.local || true
        rm -f .env.local.bak
    fi

    # Ensure Elasticsearch URL is correct
    if grep -q "ELASTICSEARCH_URL=http://localhost:9200" .env.local; then
        print_success "Elasticsearch URL configured for local development"
    else
        print_info "Updating Elasticsearch URL for local development"
        sed -i.bak 's|ELASTICSEARCH_URL=.*|ELASTICSEARCH_URL=http://localhost:9200|g' .env.local || true
        rm -f .env.local.bak
    fi

    # Ensure Ollama URL is correct
    if grep -q "OLLAMA_URL=http://localhost:11434" .env.local; then
        print_success "Ollama URL configured for local development"
    else
        print_info "Updating Ollama URL for local development"
        sed -i.bak 's|OLLAMA_URL=.*|OLLAMA_URL=http://localhost:11434|g' .env.local || true
        rm -f .env.local.bak
    fi

    # Ensure Matomo URL is localhost
    if grep -q "MATOMO_URL=http://localhost:8081" .env.local; then
        print_success "Matomo URL configured for local development"
    else
        print_info "Updating Matomo URL for local development"
        sed -i.bak 's|MATOMO_URL=.*|MATOMO_URL=http://localhost:8081|g' .env.local || true
        rm -f .env.local.bak
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Node.js Dependencies"

    if [ -d "node_modules" ]; then
        print_info "node_modules already exists"
        read -p "Reinstall dependencies? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm ci
            print_success "Dependencies reinstalled"
        else
            print_info "Skipping dependency installation"
        fi
    else
        npm ci
        print_success "Dependencies installed"
    fi
}

# Build Next.js app
build_app() {
    print_header "Building Next.js Application"

    npm run build
    print_success "Next.js app built successfully"
}

# Start Docker services
start_docker_services() {
    print_header "Starting Docker Services"

    print_info "Building Docker images..."
    docker compose build

    print_info "Starting containers in background..."
    docker compose up -d

    print_info "Waiting for services to be healthy (30 seconds)..."
    sleep 30

    # Check service health
    print_info "Checking service status..."
    docker compose ps

    # Wait for Elasticsearch to be ready
    print_info "Waiting for Elasticsearch to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:9200 > /dev/null 2>&1; then
            print_success "Elasticsearch is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_warning "Elasticsearch took too long to start, but continuing..."
        fi
        sleep 1
    done

    # Wait for Qdrant to be ready
    print_info "Waiting for Qdrant to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:6333/ > /dev/null 2>&1; then
            print_success "Qdrant is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_warning "Qdrant took too long to start, but continuing..."
        fi
        sleep 1
    done

    # Wait for Matomo database to be ready
    print_info "Waiting for Matomo database to initialize..."
    sleep 15
    print_success "Matomo database initialized"
}

# Prompt for optional Ollama installation
install_ollama() {
    print_header "Optional: Local LLM with Ollama"

    if command -v ollama &> /dev/null; then
        print_success "Ollama is already installed"
        read -p "Download and start Llama 3.1 8B? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Starting Ollama..."
            ollama pull llama-3.1-8b
            print_info "Ollama is ready (running in background)"
            print_info "To stop: killall ollama"
        fi
    else
        print_warning "Ollama not installed"
        print_info "To install Ollama locally for offline LLM inference:"
        print_info "  1. Visit https://ollama.ai"
        print_info "  2. Download and install Ollama"
        print_info "  3. Run: ollama pull llama-3.1-8b"
        print_info "  4. Then: ollama serve"
        print_info ""
        print_info "Without Ollama, the chatbot will use Claude API (requires CLAUDE_API_KEY)"
    fi
}

# Create test data directory
create_test_data() {
    print_header "Setting Up Test Data"

    if [ ! -d "test-data" ]; then
        mkdir -p test-data
        print_success "Created test-data directory"
    else
        print_info "test-data directory already exists"
    fi

    # Create a sample document for testing
    cat > test-data/sample-publication.json << 'EOF'
{
  "id": "pub-2024-001",
  "title": "Policy Response to Agricultural Productivity in Nigeria",
  "abstract": "This paper examines government agricultural policies and their impact on productivity",
  "content": "Our research shows that agricultural policies focusing on smallholder farmers have increased productivity by 15% over the past 5 years...",
  "authors": ["Dr. Adekunle Okafor", "Dr. Zainab Muhammad"],
  "year": 2024,
  "division": "Agricultural Policy",
  "type": "working_paper",
  "url": "https://niser.gov.ng/publications/pub-2024-001"
}
EOF
    print_success "Created sample publication for testing"
}

# Print next steps
print_next_steps() {
    print_header "✓ Local Development Environment Ready!"

    echo -e "${GREEN}Your local NISER environment is now running!${NC}\n"

    echo -e "${YELLOW}Service Endpoints:${NC}"
    echo "  Next.js App:      http://localhost:3000"
    echo "  Elasticsearch:    http://localhost:9200"
    echo "  Qdrant:          http://localhost:6333"
    echo "  Matomo:          http://localhost:8081"
    echo "  Nginx Proxy:     http://localhost (if configured)"
    echo ""

    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Start the Next.js development server:"
    echo "     ${BLUE}npm run dev${NC}"
    echo ""
    echo "  2. Open http://localhost:3000 in your browser"
    echo ""
    echo "  3. Test the features:"
    echo "     - Visit http://localhost:3000/chatbot"
    echo "     - Try http://localhost:3000/search?q=agriculture"
    echo "     - Check http://localhost:8081 for Matomo analytics"
    echo ""

    echo -e "${YELLOW}Useful Commands:${NC}"
    echo "  View logs:         ${BLUE}docker-compose logs -f${NC}"
    echo "  Stop services:     ${BLUE}docker-compose down${NC}"
    echo "  Restart services:  ${BLUE}docker-compose restart${NC}"
    echo "  Ingest content:    ${BLUE}curl -X POST http://localhost:3000/api/embed${NC}"
    echo "  Run tests:         ${BLUE}bash scripts/smoke-tests.js${NC}"
    echo ""

    echo -e "${YELLOW}Documentation:${NC}"
    echo "  See LOCAL_TESTING.md for detailed testing procedures"
    echo ""

    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Print stopping instructions
print_stop_instructions() {
    echo ""
    echo -e "${YELLOW}To stop services later:${NC}"
    echo "  ${BLUE}docker-compose down${NC}"
    echo ""
}

# Main execution
main() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║     NISER Local Development Environment Setup          ║"
    echo "║                                                        ║"
    echo "║  This script will:                                     ║"
    echo "║  • Check all prerequisites                             ║"
    echo "║  • Configure environment files                         ║"
    echo "║  • Install Node.js dependencies                        ║"
    echo "║  • Start Docker services (Qdrant, ES, Matomo)         ║"
    echo "║  • Build the Next.js application                       ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""

    # Run setup steps
    check_prerequisites
    setup_env_files
    install_dependencies
    create_test_data
    start_docker_services
    install_ollama
    build_app
    print_next_steps
    print_stop_instructions
}

# Run main function
main
