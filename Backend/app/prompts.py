from langchain_core.messages import HumanMessage, SystemMessage


class AgentPromptControl:
    def __init__(self, memory_provider: str, provider_host: str, provider_port: str):
        if not memory_provider or not provider_host or not provider_port:
            raise ValueError("All field is required!")
        
        self.config = {
            "vector_store": {
                "provider": memory_provider,
                "config": {"host": provider_host, "port": provider_port},
            }
        }

        self.memory = 
