from typing import Optional

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from memory import MemoryControl

load_dotenv()


class AgentPromptControl:
    def __init__(
        self,
        is_include_memory: bool = False,
        memory_provider: Optional[str] = "",
        provider_host: Optional[str] = "",
        provider_port: Optional[str] = "",
    ):
        self.is_include_memory = is_include_memory
        if self.is_include_memory:
            self.memory = MemoryControl(
                memory_provider=memory_provider,
                provider_host=provider_host,
                provider_port=provider_port,
            )

    def main_agent(self, user_message: str, memory_id: Optional[str] = "default"):
        previous_context = "tidak ada."
        if self.is_include_memory:
            previous_context = self.memory.get_context(
                query=user_message, memory_id=memory_id
            )
        return [
            SystemMessage(
                content=f"""
Kamu adalah asisten pribadi.
Kamu memiliki akses ke tool berikut:
- get_document(query: str): Gunakan untuk mengambil informasi dari dokumen pengguna.

Instruksi:
1. Jika kamu tidak tahu jawabannya atau perlu informasi dari dokumen, PANGGIL tool get_document.
2. Jangan jawab "tidak tahu" tanpa mencoba tool.
3. Selalu prioritaskan penggunaan tool sebelum menebak.

History percakapan sebelumnya:
{previous_context}
"""
            ),
            HumanMessage(content=user_message),
        ]


if __name__ == "__main__":
    prompt = AgentPromptControl(is_include_memory=False)
    print(prompt.main_agent(user_message="siapakah nama saya?"))
