import axios from "axios";
import User from "../models/User.js";
import { summarizeText } from "../services/summarization.js";

export const getNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    const response = await axios.get(url);
    const articles = response.data.articles;
    const summarizedArticles = await Promise.all(
      articles.map(async (article) => {
        try {
          const summary = await summarizeText(
            article.content || article.description || article.title
          );
          return {
            ...article,
            summary,
          };
        } catch (summarizeError) {
          console.error("Error summarizing article:", summarizeError.message);
          return {
            ...article,
            summary: "Summarization failed",
          };
        }
      })
    );

    res.json(summarizedArticles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};


export const searchNews = async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`
    );
    const articles = response.data.articles;
    const topArticles = articles.slice(0, 50);
    const summarizedArticles = await Promise.all(
      topArticles.map(async (article) => {
        try {
          const summary = await summarizeText(
            article.content || article.description || article.title
          );
          return {
            ...article,
            summary,
          };
        } catch (summarizeError) {
          console.error("Error summarizing article:", summarizeError.message);
          return {
            ...article,
            summary: "Summarization failed",
          };
        }
      })
    );

    res.json(summarizedArticles);
  } catch (error) {
    console.error("Error searching or summarizing news:", error.message);
    res.status(500).json({ message: "Error searching news" });
  }
};

export const getNewsByInterest = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const interests = user.interests;
    if (interests.length === 0)
      return res.json({ message: "No interests found" });

    const newsPromises = interests.map((interest) =>
      axios.get(
        `https://newsapi.org/v2/everything?q=${interest}&apiKey=${process.env.NEWS_API_KEY}`
      )
    );
    const responses = await Promise.all(newsPromises);

    const articles = responses.flatMap((response) => response.data.articles);
    const topArticles = articles.slice(0, 50);

    const summarizedArticles = await Promise.all(
      topArticles.map(async (article) => {
        try {
          const summary = await summarizeText(
            article.content || article.description || article.title
          );
          return {
            ...article,
            summary,
          };
        } catch (summarizeError) {
          console.error("Error summarizing article:", summarizeError.message);
          return {
            ...article,
            summary: "Summarization failed",
          };
        }
      })
    );

    res.json(summarizedArticles);
  } catch (error) {
    console.error("Error fetching or summarizing news:", error.message);
    res.status(500).json({ message: "Error fetching news" });
  }
};
