# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv()
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel("models/gemini-2.5-flash")

# response = model.generate_content("Hello Gemini, how are you?")
# print(response.text)

import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(" Loaded key:", "Found" if api_key else "Missing")

# Configure Gemini
genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content("Hello Gemini, what is the Indian Contract Act 1872?")
    print("\n Response:\n", response.text)
except Exception as e:
    print("\n Error:", e)
