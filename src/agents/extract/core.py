from openai import OpenAI
import toml
import json

class Agent:
    def __init__(self):
        self.client = OpenAI()
        config = toml.load('./src/agents/extract/config.toml')
        self.model = config['DEFAULT_QUERY_MODEL']
        self.instructions = config['prompt']['system_message']

    def generate(self, text, output_format):
        # Parse the JSON schema if it's a string
        if isinstance(output_format, str):
            output_format = json.loads(output_format)
        
        # Create the completion with structured output
        response = self.client.chat.completions.create(
            model=self.model,
            reasoning_effort="minimal",
            messages=[
                {"role": "system", "content": self.instructions},
                {"role": "user", "content": text}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "ExtractedData",
                    "schema": output_format,
                    "strict": True
                }
            }
        )
        
        # Parse and return the JSON response
        return json.loads(response.choices[0].message.content)
