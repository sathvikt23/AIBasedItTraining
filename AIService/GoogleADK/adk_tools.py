

from google.adk.tools import FunctionTool
from google.adk.tools.openapi_tool.openapi_spec_parser.openapi_toolset import OpenAPIToolset



def say_hello(name: str) -> str:
    return f"Hello, {name}! 👋"

function_tools = [
    FunctionTool(func=say_hello)
]

# -------------------------------
# ✅ OPENAPI TOOLSET
# -------------------------------
def get_openapi_tools():
    openapi_spec = {
        "openapi": "3.0.0",
        "info": {"title": "Demo API", "version": "1.0"},
        "servers": [{"url": "https://jsonplaceholder.typicode.com"}],
        "paths": {
            "/todos/1": {
                "get": {
                    "summary": "Get sample todo",
                    "responses": {
                        "200": {"description": "Success"}
                    }
                }
            }
        }
    }

    toolset = OpenAPIToolset(openapi_spec=openapi_spec)
    return getattr(toolset, "tools", [])

# Combine tools
tools = function_tools + get_openapi_tools()