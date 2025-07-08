export const extractPreferenceTool = [{
  "type": "function",
  "name": "extract_preferences",
  "description": "blah",
  "parameters": {
    "type": "object",
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
      "showType": {
        "type": "string",
          "enum": ["series", "movie", "either"],
          "default": "either"
      },
      "minYear": {
        "type": "integer",
        "default": 0
      },
      "maxYear": {
        "type": "integer",
        "default": 2100
      }
    },
    "required": ["mood", "genres", "showType", "minYear", "maxYear"],
    "additionalProperties": false
  },
}];