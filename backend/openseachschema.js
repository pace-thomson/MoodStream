export const extractTitleTool = [{
    "type": "function",
    "name": "extract_movie_title",
    "description": "Extracts potential movie or show titles from the user's text.",
    "parameters": {
      "type": "object",
      "properties": {
        "potentialTitles": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": { "type": "string" },
              "year": { "type": "integer" }
            },
            "required": ["title"]
          }
        }
      },
      "required": ["potentialTitles"]
    }
  }];