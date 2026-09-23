try:
    from langgraph.graph import END, StateGraph
except ImportError:
    END = "__END__"

    class StateGraph:
        def __init__(self, state_schema):
            self.state_schema = state_schema
            self.nodes = {}
            self.edges = {}
            self.conditional_edges = {}
            self.entry_point = None

        def add_node(self, name, func):
            self.nodes[name] = func

        def set_entry_point(self, name):
            self.entry_point = name

        def add_edge(self, from_node, to_node):
            self.edges[from_node] = to_node

        def add_conditional_edges(self, from_node, condition_func):
            self.conditional_edges[from_node] = condition_func

        def compile(self):
            class CompiledGraph:
                def __init__(self, graph):
                    self.graph = graph

                async def ainvoke(self, initial_state: dict) -> dict:
                    import inspect
                    state = dict(initial_state)
                    current_node = self.graph.entry_point
                    while current_node and current_node != END:
                        node_func = self.graph.nodes.get(current_node)
                        if not node_func:
                            break
                        if inspect.iscoroutinefunction(node_func):
                            updates = await node_func(state)
                        else:
                            updates = node_func(state)
                        if updates and isinstance(updates, dict):
                            state.update(updates)

                        if current_node in self.graph.conditional_edges:
                            next_node = self.graph.conditional_edges[current_node](state)
                        else:
                            next_node = self.graph.edges.get(current_node, END)
                        current_node = next_node
                    return state

            return CompiledGraph(self)

from src.agents.nodes.example_node import analyze_node, respond_node
from src.agents.state import AgentState


def should_continue(state: AgentState) -> str:
    """Route based on whether an error occurred during analysis."""
    if state.get("error"):
        return END
    return "respond"


def build_graph():
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("analyze", analyze_node)
    graph.add_node("respond", respond_node)

    # Add edges
    graph.set_entry_point("analyze")
    graph.add_conditional_edges("analyze", should_continue)
    graph.add_edge("respond", END)

    return graph.compile()


agent = build_graph()
