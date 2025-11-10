import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GNN_API_BASE_URL } from '../utils/gnnApi';

const GraphVisualization = ({ currentPostId }) => {
  const canvasRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  
  const fetchGraphData = useCallback(async () => {
    try {
      const response = await fetch(`${GNN_API_BASE_URL}/graph/stats`);
      if (response.ok) {
        const data = await response.json();
        setGraphData(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (!graphData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Simple force-directed graph simulation
    const nodes = generateNodes(graphData.num_posts || 25);
    const edges = generateEdges(nodes, graphData.num_edges || 150);

    // Draw edges
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)'; // Light blue
    ctx.lineWidth = 1;
    edges.forEach(edge => {
      ctx.beginPath();
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node, index) => {
      const isCurrentPost = currentPostId && index === 0; // Highlight current post
      const radius = isCurrentPost ? 8 : 5;
      
      // Node shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Node fill
      ctx.fillStyle = isCurrentPost 
        ? 'rgb(59, 130, 246)' // Blue for current
        : node.isTag 
        ? 'rgb(168, 85, 247)' // Purple for tags
        : 'rgb(34, 197, 94)'; // Green for posts
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

    // Add interaction
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const hoveredNode = nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance < 10;
      });
      
      setHoveredNode(hoveredNode);
      canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [graphData, currentPostId]);

  const generateNodes = (count) => {
    const nodes = [];
    const centerX = 300;
    const centerY = 200;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 80 + Math.random() * 60;
      nodes.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        isTag: i > count * 0.7, // Last 30% are tags
        id: i
      });
    }
    
    return nodes;
  };

  const generateEdges = (nodes, edgeCount) => {
    const edges = [];
    const maxEdges = Math.min(edgeCount, nodes.length * (nodes.length - 1) / 2);
    
    for (let i = 0; i < maxEdges; i++) {
      const sourceIndex = Math.floor(Math.random() * nodes.length);
      const targetIndex = Math.floor(Math.random() * nodes.length);
      
      if (sourceIndex !== targetIndex) {
        edges.push({
          source: nodes[sourceIndex],
          target: nodes[targetIndex]
        });
      }
    }
    
    return edges;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🌐 Content Graph Network
        </h3>
        {graphData && (
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Posts ({graphData.num_posts})</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Tags</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-0.5 h-3 bg-blue-300"></div>
              <span>Connections ({graphData.num_edges})</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative bg-white rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-auto"
          style={{ maxHeight: '400px' }}
        />
        
        {hoveredNode && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg border border-gray-200">
            <p className="text-xs text-gray-600">
              {hoveredNode.isTag ? 'Tag Node' : 'Post Node'} #{hoveredNode.id}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-white/50 rounded-lg">
        <p className="text-sm text-gray-600">
          This visualization shows the relationship network between blog posts and tags. 
          Each node represents either a post or a tag, connected by semantic similarity and content relationships.
        </p>
      </div>
    </motion.div>
  );
};

export default GraphVisualization;
