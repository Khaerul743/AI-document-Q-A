from typing import Any, Dict

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode
from models import AgentState
from prompts import AgentPromptControl
from tools import AgentTools

load_dotenv()


class Workflow:
    def __init__(self):
        self.llm_for_reasoning = ChatOpenAI(model="gpt-4o")
        self.llm_for_explanation = ChatOpenAI(model="gpt-3.5-turbo")
        self.prompts = AgentPromptControl(is_include_memory=False)
        self.tools = AgentTools()
        self.build = self._build_workflow()

    def _build_workflow(self):
        graph = StateGraph(AgentState)
        graph.add_node("main_agent", self._main_agent)
        graph.add_node("get_document", ToolNode(tools=[self.tools.get_document]))

        graph.add_edge(START, "main_agent")

        return graph.compile()

    def _main_agent(self, state: AgentState) -> Dict[str, Any]:
        prompt = self.prompts.main_agent(state.user_message)
        messages = [prompt[0]] + state.messages + [prompt[1]]
        llm = self.llm_for_reasoning.bind_tools([self.tools.get_document])
        response = llm.invoke(messages)
        return {"messages": state.messages + [response]}

    def run(self, user_message: str):
        return self.build.invoke({"messages": [], "user_message": user_message})


if __name__ == "__main__":
    agent = Workflow()
    agent.run("Hai")
