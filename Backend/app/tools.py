from langchain_core.tools import tool
from RAG import RAGSystem


class AgentTools:
    def __init__(self):
        self.rag = RAGSystem("data", "my_collections")

    @tool
    def get_document(self, query: str):
        try:
            get_document = self.rag.query(query)
            if not get_document:
                list_docs = []
                documents = self.rag.similarity_search(query)
                for document in documents:
                    detail_doc = {
                        "source": document.metadata["source"],
                        "page": document.metadata["page"],
                        "content": document.page_content,
                    }
                    list_docs.append(detail_doc)

                get_document = "Berikut adalah hasil search dari document:\n"
                for item in list_docs:
                    get_document += f"- source: {item.source}\n-page: {item.page}\n-content: {item.content}"
            return get_document
        except Exception as e:
            print(f"Terjadi kesalahan di tool get_document: {e}")
            return f"Terjadi kesalahan saat query ke document {e}"
