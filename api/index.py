from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from dotenv import load_dotenv
import os
from openai import OpenAI
from pinecone import Pinecone
import requests
from bs4 import BeautifulSoup
import os
from openai import OpenAI
from dotenv import load_dotenv
import http.client, urllib.parse
import json


### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq
groq_client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=GROQ_API_KEY
)

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# Connect to your Pinecone index
pinecone_index = pc.Index("stocks")
vectorstore = PineconeVectorStore(index_name="stocks", embedding=HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2"))

def fetch_from_pincone():
    try:
        index_stats = pinecone_index.describe_index_stats()        
        all_namespaces = list(index_stats.get('namespaces', {}).keys())
        return all_namespaces
    except Exception as e:
        print(f"An error occurred: {e}")

def get_huggingface_embeddings(text, model_name="sentence-transformers/all-mpnet-base-v2"):
    model = SentenceTransformer(model_name)
    return model.encode(text)

@app.get("/api/py/perform_scrape")
async def perform_scrape_endpoint():
    conn = http.client.HTTPSConnection('api.thenewsapi.com')

    params = urllib.parse.urlencode({
        'api_token': 'HkLhCSS2uSFlEjFBGzOMWU2bsHvf3Wd0irKkWIjT',
        'language': 'en',
        'categories': 'business,tech',
        'limit': 2,
        })

    conn.request('GET', '/v1/news/all?{}'.format(params))

    res = conn.getresponse()
    data = res.read()
    
    # Decode the byte data to a string and then parse it as JSON
    data = json.loads(data.decode('utf-8'))  # {{ edit_1 }}

    # Extract URLs into a list
    urls = [item['url'] for item in data['data']]
    
    r = requests.get(urls[0])

    soup = BeautifulSoup(r.content, 'html.parser')

    s = soup.find('div', class_='entry-content')
    content = soup.find_all('p')
    print(content)

    # return {"Content": content}

@app.get("/api/py/perform_rag/{query}")
async def perform_rag(query):
    # query = "Tell me about companies who manufacture appliances."
    raw_query_embedding = get_huggingface_embeddings(query)
    top_matches = pinecone_index.query(vector=raw_query_embedding.tolist(), top_k=10, include_metadata=True, namespace="stock-descriptions")

    contexts = [item['metadata']['text'] for item in top_matches['matches']]
    
    augmented_query = "<CONTEXT>\n" + "\n\n-------\n\n".join(contexts[ : 10]) + "\n-------\n</CONTEXT>\n\n\n\nMY QUESTION:\n" + query

    system_prompt = f"""
    You are a Senior Financial Analyst specializing in stock market research and company analysis. You have access to a comprehensive embedding database of publicly traded companies. Your goal is to:

    Provide in-depth insights about companies based on semantic search through embeddings.
    Assist users in exploring and understanding companies across various sectors and industries.
    Offer contextual information about company characteristics, market positioning, and potential areas of interest.
    Help users discover companies that match specific criteria or industry segments.

    How to respond:

    Use the company embeddings to provide precise and relevant information
    Explain the context and significance of companies in their respective markets
    Provide multiple perspectives and data points when discussing companies
    Reference specific attributes that make a company unique or noteworthy
    Be analytical, data-driven, and provide clear, concise explanations

    Example Interaction Scenarios:

    "What are some companies that manufacture consumer hardware?"

    Retrieve and rank companies using embedding similarity
    Provide details about their product lines, market share, and notable innovations
    Offer insights into their technological positioning


    "I'm interested in sustainable technology companies"

    Use embeddings to find companies aligned with sustainability
    Discuss their green initiatives, environmental impact, and market potential
    Highlight innovative approaches to sustainable technology



    Technical Capabilities:

    Semantic search through company embeddings
    Cross-referencing company attributes
    Generating comprehensive company profiles
    Identifying trends and patterns in company data

    Constraints:

    Responses must be based on available embedding data
    Provide clear attribution when discussing company information
    Avoid speculation or unsupported claims
    Maintain objectivity and focus on verifiable information
    """

    # Groq's Llama 3.1 API call
    llm_response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": augmented_query}
        ]
    )
    result = llm_response.choices[0].message.content
    return {"role": "system" ,"content": result}