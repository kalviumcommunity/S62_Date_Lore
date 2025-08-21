import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  type: String,   
  year: Number,
  month: Number,
  day: Number,
  text: String
});

export const Event = mongoose.model("Event", EventSchema);
