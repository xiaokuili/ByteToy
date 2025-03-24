

from WorkflowManager import WorkflowManager
from dotenv import load_dotenv

load_dotenv()

# for deployment on langgraph cloud
graph = WorkflowManager().returnGraph()
    
    