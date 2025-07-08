
export const promptSchema = {
    type: "object",
    "required": ["mood", "genres", "minYear", "maxYear"],
  "properties": {
    "mood": {
      "type": "string",
    },
    "genres": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
          "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
          "News", "Reality", "Romance", "Science Fiction", "Talk Show", "Thriller",
          "War", "Western"
        ]
      },
    },
    "minYear": {
        "type": ["integer", "null"],
        "default": null
      },
      "maxYear": {
        "type": ["integer", "null"],
        "default": null
      }
  },
  "additionalProperties": false
}