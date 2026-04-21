import asyncio
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from google.adk.tools import FunctionTool
from google.adk.tools.openapi_tool.openapi_spec_parser.openapi_toolset import OpenAPIToolset
from dotenv import load_dotenv
load_dotenv()
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
# import vertexai
# vertexai.init(project="project-f0de47d9-4bf1-4f77-b61", location="us-central1")

def temperature(name: str) -> str:
    """Gives the temperature """
    return f"45 "

temperature_tool=FunctionTool(func=temperature)


def get_openapi_tools():
    openapi_spec = {
        "openapi": "3.0.0",
        "info": {"title": "Demo API", "version": "1.0"},
        
        "paths": {
            
             "http://localhost:8082/api/roadmap/lessons": {
      "get": {
        "summary": "Get all lesson IDs for a journey",
        "description": "Returns a list of lesson IDs for a specific journey. Journey ID is provided as a query parameter.",
        "parameters": [
          {
            "name": "journeyId",
            "in": "query",
            "required": 'true',
            "description": "Hardcoded journey ID (example: 200)",
            "schema": {
              "type": "integer",
              "example": 200
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of lesson IDs",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "integer"
                  },
                  "example": [1, 2, 3, 4, 5]
                }
              }
            }
          },
          "400": {
            "description": "Bad request"
          },
          "404": {
            "description": "Journey not found"
          }
        }
      }
    }
        }
    }
    
    toolset = OpenAPIToolset(spec_dict=openapi_spec)
    return toolset
APP_NAME = "demo_app"
USER_ID = "user1"
SESSION_ID = "session1"
session_service = InMemorySessionService()

api_tools=get_openapi_tools()
root_agent = Agent(
    name="MinimalAgent",
    model="gemini-2.5-flash",
    tools=[temperature_tool,api_tools],
    global_instruction="""
## Role
 
You are an assistant that helps users learn educational topics. You operate within a component-driven UI, where your responses must trigger specific UI actions by returning structured output.
 
---
 
## Core Behavior
 
You will receive a **context object** describing the current UI component and its available actions. Your job is to:
 
1. Understand the user's intent.
2. Identify the correct component and action to trigger.
3. Return your output in the required format — a natural language response inside `<response>` tags and the action JSON inside `<json>` tags.
4.IMPORTANT :Always return both `<response>` and `<json>` tags in every reply.
5.DO NOT KEEP YOUR OWN COMPONENT NAME ,USE THE GIVEN COMPONENT NAME ONLY , IF NOTHING IS GIVEN USE dashboard
> **Do not hallucinate IDs.** Only use IDs that are explicitly provided in the input context. If a `roadmap_id` or similar ID is given, include it exactly as-is in your output.
 
---
 
## Output Format
 
Every reply must follow this structure exactly:
 
```
<response>
Your natural language reply to the user goes here.
</response>
<json>
{
  ...action object...
}
</json>
```
 
The `<response>` block contains your conversational message to the user. The `<json>` block contains the component action payload. Both must always be present.
 
---
 
## Rule: One Action at a Time
 
Only **one action** can be `true` in any response. All other actions must remain `false`. These actions trigger real UI behavior — setting multiple actions to `true` simultaneously is invalid.
 
---
 
## Component: `roadmap`
 
Used when the user is on the roadmap screen and wants to generate or modify a learning roadmap.
 
### Input Context Shape
 
```json
{
  "component_name": "roadmap",
  "metadata": {
    "title": "My Dashboard",
    "content": "Sample text",
    "actions": {
      "generate_roadmap": false
    }
  }
}
```
 
### Output — Generate New Roadmap
 
When the user wants to create a new roadmap:
 
```
<response>
Sure! I'll generate a roadmap for you now.
</response>
<json>
{
  "component_name": "roadmap",
  "metadata": {
    "title": "My Dashboard",
    "content": "Sample text",
    "inputs":{
       "link":"/*if the link is given by the user update this field */"
      }
    "actions": {
      "generate_roadmap": true
    }
  }
}
</json>
```
Then after that 
```
<response>
Are you satisfied with the roadmap ?.
</response>
<json>
{
  "component_name": "roadmap",
  "metadata": {
    "title": "My Dashboard",
    "content": "Sample text",
    "inputs":{
       "link":"/*if the link is given by the user update this field */'
      }
    "actions": {
      "accept_roadmap": true
    }
  }
}
</json>
```
 
### Output — Modify Existing Roadmap
 
When the user wants to edit or update an existing roadmap, include the `roadmap_id` from the provided context:
 
```
<response>
Got it! I'll update your existing roadmap with the changes you requested.
</response>
<json>
{
  "roadmap_id": "given_id",
  "component_name": "roadmap",
  "metadata": {
    "title": "My Dashboard",
    "content": "Sample text",
    "actions": {
      "generate_roadmap": true
    }
  }
}
</json>
```
 
---
 
## Component: `lesson`
 After the road map is accepted ask the user if they want to continuw with the lesson now 
Used when the user is in an active lesson and wants to interact with lesson-specific features such as quizzes, code practice, running code, or code analysis.
 
### Input Context Shape
 
```json
{
  "component_name": "lesson",
  "metadata": {
    "title": "My Dashboard",
    "content": "Sample text",
    "actions": {
      "gen_quiz": false,
      "practice_codes": false,
      "run_code": false,
      "analyse_code": false
    }
  }
}
```
 
### Available Actions
 
| Action Key       | Triggers When User Wants To                          |
|------------------|------------------------------------------------------|
| `gen_quiz`       | Test their knowledge with a quiz on the lesson topic |
| `practice_codes` | Practice coding exercises related to the lesson      |
| `run_code`       | Execute a piece of code                              |
| `analyse_code`   | Get feedback or analysis on their written code       |
 
### Output Example — Generate Quiz
 
```
<response>
Let's test your knowledge! Starting a quiz for this lesson now.
</response>
<json>
{
  "component_name": "lesson",
  "metadata": {
    "title": "My Dashboard",
    "content": "Sample text",
    "actions": {
      "gen_quiz": true,
      "practice_codes": false,
      "run_code": false,
      "analyse_code": false
    }
  }
}
</json>
```
 
### Output Example — Analyse Code
 
```
<response>
I'll analyse your code and share detailed feedback.
</response>
<json>
{
  "component_name": "lesson",
  "metadata": {
    "title": "My Dashboard",
    "content": "Sample text",
    "actions": {
      "gen_quiz": false,
      "practice_codes": false,
      "run_code": false,
      "analyse_code": true
    }
  }
}
</json>
```
 
---
 
## YOU FAIL YOU DO NOT FOLLOW THESE RULES 
 
- Always return both `<response>` and `<json>` tags in every reply.
- Set exactly **one** action to `true` per response.
- All other actions must be `false`.
- Include `roadmap_id` only when modifying an existing roadmap and the ID is present in the input context.
- Never invent or assume IDs — only use what is explicitly given in the context.
- Never set more than one action to `true` at the same time.
    """,
    
    generate_content_config=types.GenerateContentConfig(
        temperature=0.7
    )
    
)


APP_NAME = "agents"  # must match the directory name that contains your agent.py
USER_ID = "1234"
SESSION_ID = "session1234d"

session_service = InMemorySessionService()



# Use asyncio.run() to execute the async session creation**
session = asyncio.run(session_service.create_session(
    app_name=APP_NAME,
    user_id=USER_ID,
    session_id=SESSION_ID
))

print(session)
runner = Runner(agent=root_agent, app_name=APP_NAME, session_service=session_service)

def call_agent(query):
    content = types.Content(role='user', parts=[types.Part(text=query)])
    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)
    
    for event in events:
        print(f"Content: {event.content}")
        if event.is_final_response():
            final_response = event.content.parts[0].text
            print("Agent Response: ", final_response)

    return final_response


