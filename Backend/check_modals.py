import google.generativeai as genai

genai.configure(api_key="AIzaSyDWveNzU0f8WXJbL2lweVfSLiz9wvq8_tM")

for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        print(m.name)
