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
            "action", "adventure", "animation", "comedy", "crime", "documentary",
            "drama", "family", "fantasy", "history", "horror", "music", "mystery",
            "news", "reality", "romance", "scifi", "talk", "thriller",
            "war", "western"
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