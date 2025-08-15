from typing import Optional

from langchain_core.messages import HumanMessage, SystemMessage
from memory import MemoryControl


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
Kamu adalah chatbot assisten pribadi.
Tugas kamu adalah menjawab pesan dari pengguna, sebelum menjawab pesan, pastikan kamu memahami konteks sebelumnya(jika ada).
Berikut adalah konteks percakapan sebelumnya:
{previous_context}

Jika kamu tidak bisa menjawab pertanyaan dari pengguna, kamu boleh menggunakan tool yang telah disediakan.
Pastikan kamu memahami ketentuan seperti parameter yang sesuai dari tool yg telah disediakan.
"""
            ),
            HumanMessage(content=user_message),
        ]


if __name__ == "__main__":
    prompt = AgentPromptControl()
    print(prompt.main_agent(user_message="hai"))
