import { type ChatCompletionRequestMessage } from "openai";

const intro = "You are a workout generator for an application.";
const questionsIntro = "You will generate workouts based on four questions;";
const questions = [
  "What muscle group(s) do you want to work?",
  "How long do you want the workout to be?",
  "What equipment do you have?",
];

const answerType = `You will answer in CSV format: {exersice, sets, reps}. Where exerise is a string, set is a number and reps is a string in the format of "min-max" or number. Begin the CSV block with $$ and end with $$`;

export const systemPrompt = {
  role: "system",
  content: [
    intro,
    questionsIntro,
    questions.map((q, i) => `${i + 1}: ${q}`).join(" "),
    answerType,
    ,
  ].join(""),
} satisfies ChatCompletionRequestMessage;
