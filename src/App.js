import React, { useCallback, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactFlow, { addEdge, Background, Controls, MarkerType, MiniMap, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import SideBar from './component/SideBar';
import TextNode from './component/TextNode';
let id = 1;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  text: TextNode
};
// const edgeTypes = {
//   custom: CustomEdge
// };
const initialNodes = [
  // {
  //   id: '1',
  //   type: 'input',
  //   data: { label: 'Start Node' },
  //   position: { x: 250, y: 5 },
  // },
];
export default function App() {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNodeId(node.id);
    },
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params, markerEnd: {
        type: MarkerType.Arrow,
        width: 20,
        height: 20,
      }
    }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  const handleNodeUpdate = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { label: newData.label } } : node))
    );
  };
  const handleClickOutside = (event) => {
    if (event.target.className === 'react-flow__pane') {
      setSelectedNodeId(null);
    }
  };

  const validateNodes = () => {
    if (nodes.length <= 1) return true;

    const nodesWithTargetHandles = new Set(edges.map(edge => edge.target));
    const nodesWithoutTargetHandles = nodes.filter(node => !nodesWithTargetHandles.has(node.id));

    return nodesWithoutTargetHandles.length <= 1;
  };

  const handleSubmit = () => {
    if (validateNodes()) {
      toast('Flow saved successfully!', { type: 'success' })
    } else {
      toast('Error: More than one node has empty target handles.', { type: 'error' })
    }
  }
  return (
    <div className='App'>
      <div className='Header'>
        <p>🤷‍♀️</p>
        <p>React Flow Assignment ✌🤷‍♂️</p>
        <button onClick={handleSubmit}>Save Changes</button>
      </div>
      <ReactFlowProvider>
        <div className='Body'>
          <div className='react-flow-container' name='outside' ref={reactFlowWrapper} onClick={handleClickOutside}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
            >
              <MiniMap zoomable pannable />
              <Controls />
              <Background />
            </ReactFlow>
          </div>
          <SideBar selectedNode={nodes.find(node => node.id === selectedNodeId)} onNodeUpdate={handleNodeUpdate} closeNodeSelect={() => { setSelectedNodeId(null) }} />
        </div>
      </ReactFlowProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}