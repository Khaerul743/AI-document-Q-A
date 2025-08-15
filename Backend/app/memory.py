from typing import List

from mem0 import Memory


class MemoryControl:
    def __init__(
        self,
        memory_provider: str,
        provider_host: str,
        provider_port: str,
    ) -> None:
        if not memory_provider or not provider_host or not provider_port:
            raise ValueError("All field is required!")

        self.config = {
            "vector_store": {
                "provider": memory_provider,
                "config": {"host": provider_host, "port": provider_port},
            }
        }

        self.memory = Memory.from_config(self.config)

    def get_context(self, query: str, memory_id: str):
        get_memory = self.memory.search(query=query, user_id=memory_id)
        memories = "\n".join(
            [f"- {entry['memory']}" for entry in get_memory["results"]]
        )
        return memories

    def add_context(self, list_messages: List, memory_id: str):
        return self.memory.add(list_messages, user_id=memory_id)
