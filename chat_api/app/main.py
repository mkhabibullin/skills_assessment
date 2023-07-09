from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from os import path
import logging
from transformers import AutoModelWithLMHead, AutoTokenizer

log_file_path = path.join(path.dirname(path.abspath(__file__)), 'logging.conf')
logging.config.fileConfig(log_file_path)
logger = logging.getLogger()

logger.info('Model initialization ...')
tokenizer = AutoTokenizer.from_pretrained('model/')
model = AutoModelWithLMHead.from_pretrained('model/')
logger.info('Model initialization finished.')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    

@app.get("/message")
async def main_route(data: str):
    try:
        logger.info(f'Message: {data}')

        bot_input_ids = tokenizer.encode(data + tokenizer.eos_token, return_tensors='pt')

        chat_history_ids = model.generate(
            bot_input_ids, max_length=100,
            pad_token_id=tokenizer.eos_token_id,  
            no_repeat_ngram_size=3,       
            do_sample=True, 
            top_k=10, 
            top_p=0.7,
            temperature = 0.8
        )

        predicted = tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)

        logger.info(f'Predicted response: {predicted}')

        return predicted
    except Exception as e:
        logger.critical(e, exc_info=True)
