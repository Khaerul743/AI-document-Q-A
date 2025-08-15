from langchain_core.tools import tool


class AgentTools:
    def __init__(self):
        pass

    @tool
    def get_document(self, query: str):
        """Gunakan tool ini untuk mengambil informasi dari document."""
        return "His name is khaerul"
