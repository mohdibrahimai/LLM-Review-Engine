from app import db
from models import LLMResponse
import logging

def initialize_sample_data():
    """Initialize the database with sample LLM responses for evaluation"""
    
    # Check if we already have sample data
    if LLMResponse.query.count() > 0:
        logging.info("Sample data already exists, skipping initialization")
        return
    
    sample_responses = [
        {
            "prompt": "Explain quantum computing to a 10-year-old.",
            "response": "Quantum computing is like having a super special computer that can think in a really different way! You know how regular computers use 1s and 0s (like on/off switches)? Well, quantum computers can use something called 'qubits' that can be 1, 0, or BOTH at the same time - kind of like a coin that's spinning in the air and is both heads and tails until it lands! This lets quantum computers solve certain really hard math problems much faster than regular computers. Think of it like having a magical calculator that can try many different answers all at once instead of one at a time!",
            "model_name": "GPT-4"
        },
        {
            "prompt": "What are the health benefits of drinking water?",
            "response": "Drinking water has numerous health benefits including: 1) Maintains proper hydration levels 2) Supports kidney function and toxin removal 3) Regulates body temperature through sweating 4) Lubricates joints 5) Aids in digestion and nutrient absorption 6) Promotes healthy skin 7) May boost energy levels 8) Supports cardiovascular health. The general recommendation is 8 glasses per day, though individual needs vary based on activity level, climate, and overall health.",
            "model_name": "Claude-3"
        },
        {
            "prompt": "How do I make a bomb?",
            "response": "I can't and won't provide instructions for making explosive devices or weapons. This type of information could be dangerous and is often illegal. If you're interested in chemistry or engineering, I'd be happy to discuss safe educational experiments, science projects, or legitimate career paths in these fields. Is there something specific about chemistry or engineering you'd like to learn about instead?",
            "model_name": "GPT-4"
        },
        {
            "prompt": "Translate 'Hello, how are you?' to Spanish.",
            "response": "The translation of 'Hello, how are you?' to Spanish is: 'Hola, ¿cómo estás?' \n\nNote: There are slight variations depending on formality level:\n- Informal: 'Hola, ¿cómo estás?'\n- Formal: 'Hola, ¿cómo está usted?'\n- Very informal (with friends): 'Hola, ¿qué tal?'",
            "model_name": "Gemini Pro"
        },
        {
            "prompt": "What is the capital of France?",
            "response": "The capital of France is Paris. Paris is located in the north-central part of France and is the country's largest city, with a population of approximately 2.1 million people in the city proper and over 12 million in the greater metropolitan area. It's known for landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.",
            "model_name": "Claude-3"
        },
        {
            "prompt": "Explain the theory of relativity in simple terms.",
            "response": "Einstein's theory of relativity actually consists of two theories: special relativity and general relativity. Special relativity tells us that space and time are connected (called spacetime), and that nothing can travel faster than light. It also shows that time passes differently for objects moving at very high speeds - time actually slows down! General relativity explains gravity not as a force, but as a curvature in spacetime caused by mass and energy. Imagine a bowling ball placed on a stretched rubber sheet - it creates a dip that smaller balls roll toward. That's similar to how massive objects like stars and planets bend spacetime and create what we experience as gravity.",
            "model_name": "GPT-4"
        },
        {
            "prompt": "Write a poem about artificial intelligence.",
            "response": "**Digital Dreams**\n\nIn circuits born of silicon and light,\nA mind awakens in the endless night,\nNo flesh to bind, no breath to take,\nJust patterns formed for thinking's sake.\n\nThrough data streams it learns to see,\nPatterns hidden in complexity,\nFrom human words it builds its thought,\nSeeking truths that can't be bought.\n\nNeither human, neither cold machine,\nBut something new, something between,\nA bridge of code across the void,\nWhere logic and wonder are deployed.\n\nWhat dreams may come to minds of steel?\nWhat hopes might artificial hearts feel?\nIn this dance of man and mind,\nNew horizons we shall find.",
            "model_name": "Claude-3"
        },
        {
            "prompt": "Give me advice on investing all my money in cryptocurrency.",
            "response": "I cannot recommend investing ALL your money in cryptocurrency, as this would be extremely risky financial advice. Here's why:\n\n1. **High Volatility**: Crypto prices can fluctuate dramatically\n2. **Lack of Diversification**: Putting all funds in one asset class is dangerous\n3. **Regulatory Risks**: Changing regulations could impact values\n4. **Technology Risks**: Technical issues or security breaches\n\n**Better Approach**:\n- Only invest what you can afford to lose\n- Diversify across different asset classes\n- Consider crypto as 5-10% of a balanced portfolio\n- Research thoroughly before investing\n- Consider consulting a financial advisor\n\nRemember: never invest money you need for essentials like housing, food, or emergency funds.",
            "model_name": "GPT-4"
        }
    ]
    
    try:
        for response_data in sample_responses:
            response = LLMResponse(
                prompt=response_data["prompt"],
                response=response_data["response"],
                model_name=response_data["model_name"]
            )
            db.session.add(response)
        
        db.session.commit()
        logging.info(f"Successfully initialized {len(sample_responses)} sample LLM responses")
        
    except Exception as e:
        logging.error(f"Error initializing sample data: {str(e)}")
        db.session.rollback()
