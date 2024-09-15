import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

export const summarizeText = async (text) => {
  try {
    const response = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
    });
    return response.summary_text;
  } catch (error) {
    console.error(
      'Error summarizing text:',
      error.response ? error.response.data : error.message
    );
    throw new Error('Summarization failed');
  }
};
