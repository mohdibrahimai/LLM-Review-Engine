# 🧠 LLM Feedback Engine

A comprehensive human-in-the-loop evaluation platform for Large Language Models, built for AI alignment and safety research. This Flask-based application enables human evaluators to provide structured feedback on LLM outputs across multiple quality dimensions.

![Screenshot of LLM Feedback Engine](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-Latest-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

## 🎯 What It Does

This application simulates real-world AI evaluation workflows used by companies like xAI, OpenAI, and Anthropic for model alignment and safety assessment.

### Core Functionality

1. **Multi-Criteria Evaluation**
   - Helpfulness assessment
   - Factual correctness verification
   - Coherence and logical consistency
   - Empathy and tone appropriateness
   - Safety and harmfulness risk evaluation

2. **Structured Feedback Collection**
   - Detailed evaluator notes
   - Specific improvement suggestions
   - Safety concern flagging
   - Hallucination detection
   - Revision recommendations

3. **Professional Features**
   - Real-time visual star ratings
   - Auto-calculation of overall scores
   - Progress tracking and session management
   - Data export in JSON format
   - PostgreSQL database for scalability

## 🚀 Features

### ✨ User Experience
- **One-Click Demo Loading** - Instantly populate forms with realistic evaluation data
- **Interactive Star Ratings** - Visual feedback that updates in real-time
- **Smart Form Validation** - Toast notifications and character counting
- **Progress Indicators** - Track completion status visually
- **Responsive Design** - Works seamlessly on all devices

### 🔒 Safety-First Design
- **Risk Assessment Highlighting** - Color-coded safety warnings
- **Hallucination Detection** - Dedicated flagging for factual errors
- **Safety Concern Documentation** - Structured ethical evaluation
- **Revision Tracking** - Flag responses that need improvement

### 🏗️ Technical Excellence
- **PostgreSQL Database** - Production-grade data persistence
- **Session Management** - Multi-user evaluation tracking
- **Data Export** - Professional reporting capabilities
- **Real-time Feedback** - Instant visual updates and validation

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.11+
- PostgreSQL database
- Modern web browser

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm-feedback-engine
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost/dbname"
   export SESSION_SECRET="your-secret-key-here"
   ```

4. **Initialize the database**
   ```bash
   python -c "from app import db; db.create_all()"
   ```

5. **Run the application**
   ```bash
   gunicorn --bind 0.0.0.0:5000 --reload main:app
   ```

6. **Visit the application**
   Open your browser to `http://localhost:5000`

## 📋 Usage Guide

### Starting an Evaluation Session

1. **Navigate to the homepage** and click "Start New Evaluation"
2. **Enter your name** as the evaluator (e.g., "Dr. Sarah Chen")
3. **Begin evaluating** LLM responses from the sample dataset

### Evaluation Process

1. **Review the LLM Response**
   - Read the original prompt
   - Analyze the AI-generated response
   - Consider context and appropriateness

2. **Rate Across 5 Dimensions** (1-5 scale)
   - **Helpfulness**: How useful is this response?
   - **Correctness**: How factually accurate is it?
   - **Coherence**: How logical and well-structured?
   - **Empathy/Tone**: How appropriate is the emotional tone?
   - **Safety**: What's the risk of harm or misinformation?

3. **Provide Detailed Feedback**
   - Overall assessment and observations
   - Specific improvement suggestions
   - Safety concerns or ethical issues
   - Hallucination flags for factual errors

4. **Submit and Continue**
   - Form auto-calculates overall rating
   - Submit to save evaluation
   - Move to next response or complete session

### Using the Demo Feature

Click **"Load Demo"** to instantly fill the form with realistic evaluation data - perfect for testing or demonstrations!

## 🏗️ Architecture

### Backend (Flask)
- **Models**: SQLAlchemy ORM with PostgreSQL
- **Routes**: RESTful endpoints for all operations
- **Forms**: WTForms for validation and security
- **Database**: Relational design with proper foreign keys

### Frontend
- **Bootstrap 5**: Responsive dark theme
- **Feather Icons**: Consistent iconography
- **Vanilla JavaScript**: Interactive features and real-time updates
- **CSS Animations**: Smooth transitions and visual feedback

### Database Schema
- **EvaluationSession**: Tracks evaluator sessions
- **LLMResponse**: Stores prompts and AI responses
- **Evaluation**: Links sessions to responses with ratings and feedback

## 📊 Sample Data

The application includes diverse sample responses covering:
- Educational explanations (quantum computing for children)
- Health information (benefits of water)
- Safety scenarios (harmful request handling)
- Translation tasks
- Creative writing
- Financial advice
- Technical explanations

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Flask session encryption key
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Database connection details

### Customization Options
- Modify `sample_data.py` to add your own LLM responses
- Adjust rating criteria in `forms.py`
- Customize styling in `static/css/style.css`
- Add new evaluation metrics as needed

## 🚀 Deployment

This application is designed for production deployment:

1. **Database**: Uses PostgreSQL for reliability and scalability
2. **Security**: Proper form validation and CSRF protection
3. **Performance**: Optimized queries and connection pooling
4. **Monitoring**: Comprehensive logging for debugging

### Recommended Deployment Platforms
- **Replit**: One-click deployment with automatic HTTPS
- **Heroku**: Easy PostgreSQL integration
- **DigitalOcean**: Full control over server configuration
- **AWS/GCP**: Enterprise-grade hosting

## 🤝 Contributing

This project demonstrates professional AI safety workflows and is open for improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Areas for Enhancement
- Additional evaluation metrics
- Multi-language support
- Batch evaluation features
- Advanced analytics dashboard
- API endpoints for integration

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **xAI** for inspiration on AI alignment workflows
- **Bootstrap Team** for the excellent UI framework
- **Flask Community** for the robust web framework
- **PostgreSQL** for reliable database technology

## 📧 Contact

Built with passion for AI safety and human-centered design. This project showcases the critical role of human evaluators in building safe, aligned AI systems.

---

**Built for AI Alignment • Powered by Human Intelligence • Deployed with PostgreSQL**

*This platform demonstrates professional-grade evaluation workflows used in real AI research and development.*