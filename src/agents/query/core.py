from openai import OpenAI
from typing import Literal
from pydantic import BaseModel
import toml
import json

class AgentOutput(BaseModel):
    json_schema: str

class Agent:
    def __init__(self):
        self.client = OpenAI()

        config = toml.load('./src/agents/query/config.toml')
        
        self.temperature = int(config['temperature'])
        self.model = config['DEFAULT_QUERY_MODEL']
        self.instructions = config['prompt']['system_message']

    def generate(self, text):
        response = self.client.responses.parse(
            model=self.model,
            reasoning={
                "effort": "minimal"
            },
            temperature=self.temperature,
            instructions=self.instructions,
            input=text,
            text_format=AgentOutput
        )

        return response.output_parsed.json_schema

if __name__ == "__main__":
    agent = Agent()
    query = """
{
  job_categories[]
  jobs[] {
    company_name
    role
  }
}
    """
    print(agent.generate(query))