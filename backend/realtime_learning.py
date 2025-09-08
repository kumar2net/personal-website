"""
Real-time Learning Module for Neural Graph Recommender
Enables online graph updates and continuous learning from user interactions
"""

import torch
import torch.nn.functional as F
from torch_geometric.data import Data
import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from collections import deque, defaultdict
import asyncio
import json
import logging
from threading import Lock

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RealtimeLearningEngine:
    """Handles real-time graph updates and online learning"""
    
    def __init__(self, base_recommender, update_interval: int = 300):
        """
        Initialize real-time learning engine
        
        Args:
            base_recommender: Base NeuralGraphRecommenderMVP instance
            update_interval: Interval between model updates in seconds
        """
        self.base_recommender = base_recommender
        self.update_interval = update_interval
        
        # Interaction buffers
        self.interaction_buffer = deque(maxlen=1000)
        self.edge_update_buffer = []
        self.node_feature_updates = defaultdict(list)
        
        # Learning parameters
        self.learning_rate = 0.001
        self.batch_size = 32
        self.update_threshold = 50  # Minimum interactions before update
        
        # Thread safety
        self.buffer_lock = Lock()
        self.model_lock = Lock()
        
        # Statistics
        self.stats = {
            'total_interactions': 0,
            'model_updates': 0,
            'last_update': None,
            'edge_additions': 0,
            'feature_updates': 0
        }
        
        # Start background update task
        self.update_task = None
        self.is_running = False
        
    async def start(self):
        """Start the real-time learning engine"""
        self.is_running = True
        self.update_task = asyncio.create_task(self._periodic_update_loop())
        logger.info("Real-time learning engine started")
        
    async def stop(self):
        """Stop the real-time learning engine"""
        self.is_running = False
        if self.update_task:
            self.update_task.cancel()
            try:
                await self.update_task
            except asyncio.CancelledError:
                pass
        logger.info("Real-time learning engine stopped")
        
    async def _periodic_update_loop(self):
        """Periodically update the model with accumulated interactions"""
        while self.is_running:
            try:
                await asyncio.sleep(self.update_interval)
                
                # Check if we have enough interactions
                if len(self.interaction_buffer) >= self.update_threshold:
                    await self.update_model()
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in periodic update loop: {e}")
                
    def record_interaction(self, interaction: Dict):
        """
        Record a user interaction for learning
        
        Args:
            interaction: Dictionary containing interaction details
                - user_id: User identifier
                - post_id: Post that was interacted with
                - action: Type of interaction (view, click, like, share, etc.)
                - timestamp: When the interaction occurred
                - context: Additional context (source_post, search_query, etc.)
        """
        with self.buffer_lock:
            # Add timestamp if not present
            if 'timestamp' not in interaction:
                interaction['timestamp'] = datetime.now().isoformat()
            
            # Add to buffer
            self.interaction_buffer.append(interaction)
            self.stats['total_interactions'] += 1
            
            # Process interaction for graph updates
            self._process_interaction_for_graph(interaction)
            
            logger.debug(f"Recorded interaction: {interaction['action']} on {interaction['post_id']}")
            
    def _process_interaction_for_graph(self, interaction: Dict):
        """Process interaction to determine graph updates"""
        action = interaction.get('action')
        post_id = interaction.get('post_id')
        context = interaction.get('context', {})
        
        # Determine edge updates based on interaction type
        if action in ['click', 'view'] and 'source_post' in context:
            # User navigated from one post to another
            source_post = context['source_post']
            self._propose_edge_update(source_post, post_id, weight=0.5)
            
        elif action in ['like', 'share']:
            # Strong positive signal - boost connections
            if 'related_posts' in context:
                for related_post in context['related_posts']:
                    self._propose_edge_update(post_id, related_post, weight=0.8)
                    
        elif action == 'search_click':
            # User clicked on search result
            if 'search_query' in context:
                # Update post features based on search relevance
                self._propose_feature_update(post_id, 'search_relevance', 1.0)
                
    def _propose_edge_update(self, source: str, target: str, weight: float):
        """Propose a new edge or edge weight update"""
        # Get node indices
        source_idx = self.base_recommender.graph_builder.post_to_idx.get(source)
        target_idx = self.base_recommender.graph_builder.post_to_idx.get(target)
        
        if source_idx is not None and target_idx is not None:
            self.edge_update_buffer.append({
                'source': source_idx,
                'target': target_idx,
                'weight': weight,
                'timestamp': datetime.now()
            })
            
    def _propose_feature_update(self, post_id: str, feature: str, value: float):
        """Propose a node feature update"""
        post_idx = self.base_recommender.graph_builder.post_to_idx.get(post_id)
        
        if post_idx is not None:
            self.node_feature_updates[post_idx].append({
                'feature': feature,
                'value': value,
                'timestamp': datetime.now()
            })
            
    async def update_model(self):
        """Update the model with accumulated interactions"""
        with self.model_lock:
            try:
                logger.info("Starting model update...")
                
                # Get current interactions
                with self.buffer_lock:
                    interactions = list(self.interaction_buffer)
                    edge_updates = self.edge_update_buffer.copy()
                    feature_updates = dict(self.node_feature_updates)
                    
                    # Clear buffers
                    self.edge_update_buffer.clear()
                    self.node_feature_updates.clear()
                
                # Update graph structure
                if edge_updates:
                    self._update_graph_edges(edge_updates)
                    
                # Update node features
                if feature_updates:
                    self._update_node_features(feature_updates)
                    
                # Fine-tune model
                if interactions:
                    await self._finetune_model(interactions)
                    
                # Update statistics
                self.stats['model_updates'] += 1
                self.stats['last_update'] = datetime.now().isoformat()
                self.stats['edge_additions'] += len(edge_updates)
                self.stats['feature_updates'] += len(feature_updates)
                
                logger.info(f"Model update completed. Edges: {len(edge_updates)}, Features: {len(feature_updates)}")
                
            except Exception as e:
                logger.error(f"Error updating model: {e}")
                
    def _update_graph_edges(self, edge_updates: List[Dict]):
        """Update graph edges based on interactions"""
        if not self.base_recommender.graph_data:
            return
            
        current_edges = self.base_recommender.graph_data.edge_index
        new_edges = []
        
        for update in edge_updates:
            source = update['source']
            target = update['target']
            
            # Check if edge already exists
            edge_exists = False
            for i in range(current_edges.shape[1]):
                if (current_edges[0, i] == source and current_edges[1, i] == target):
                    edge_exists = True
                    break
                    
            if not edge_exists:
                new_edges.append([source, target])
                new_edges.append([target, source])  # Bidirectional
                
        if new_edges:
            # Add new edges to graph
            new_edge_tensor = torch.tensor(new_edges, dtype=torch.long).t()
            self.base_recommender.graph_data.edge_index = torch.cat(
                [current_edges, new_edge_tensor], dim=1
            )
            logger.info(f"Added {len(new_edges)} new edges to graph")
            
    def _update_node_features(self, feature_updates: Dict[int, List[Dict]]):
        """Update node features based on interactions"""
        if not self.base_recommender.graph_data:
            return
            
        for node_idx, updates in feature_updates.items():
            if node_idx < self.base_recommender.graph_data.x.shape[0]:
                # Aggregate feature updates
                feature_deltas = {}
                for update in updates:
                    feature = update['feature']
                    value = update['value']
                    
                    if feature not in feature_deltas:
                        feature_deltas[feature] = []
                    feature_deltas[feature].append(value)
                    
                # Apply aggregated updates
                for feature, values in feature_deltas.items():
                    # Simple averaging for now
                    avg_value = np.mean(values)
                    
                    # Update specific feature dimensions
                    if feature == 'search_relevance':
                        # Update last few dimensions as search signal
                        self.base_recommender.graph_data.x[node_idx, -3:] += avg_value * 0.1
                        
    async def _finetune_model(self, interactions: List[Dict]):
        """Fine-tune the GNN model based on interactions"""
        if not self.base_recommender.model or not interactions:
            return
            
        try:
            # Prepare training data from interactions
            positive_pairs = []
            negative_pairs = []
            
            for interaction in interactions:
                post_id = interaction.get('post_id')
                post_idx = self.base_recommender.graph_builder.post_to_idx.get(post_id)
                
                if post_idx is None:
                    continue
                    
                action = interaction.get('action')
                context = interaction.get('context', {})
                
                # Create positive pairs for liked/shared content
                if action in ['like', 'share']:
                    if 'source_post' in context:
                        source_idx = self.base_recommender.graph_builder.post_to_idx.get(
                            context['source_post']
                        )
                        if source_idx is not None:
                            positive_pairs.append((source_idx, post_idx))
                            
                # Create negative pairs for skipped content
                elif action == 'skip':
                    if 'source_post' in context:
                        source_idx = self.base_recommender.graph_builder.post_to_idx.get(
                            context['source_post']
                        )
                        if source_idx is not None:
                            negative_pairs.append((source_idx, post_idx))
                            
            if not positive_pairs and not negative_pairs:
                return
                
            # Perform mini-batch gradient descent
            self.base_recommender.model.train()
            optimizer = torch.optim.Adam(
                self.base_recommender.model.parameters(),
                lr=self.learning_rate
            )
            
            # Create batch
            batch_size = min(self.batch_size, len(positive_pairs) + len(negative_pairs))
            
            for _ in range(5):  # Few epochs of fine-tuning
                # Sample batch
                if positive_pairs:
                    pos_batch = positive_pairs[:batch_size//2]
                else:
                    pos_batch = []
                    
                if negative_pairs:
                    neg_batch = negative_pairs[:batch_size//2]
                else:
                    neg_batch = []
                    
                # Forward pass
                embeddings = self.base_recommender.model(
                    self.base_recommender.graph_data.x,
                    self.base_recommender.graph_data.edge_index
                )
                
                # Compute loss
                loss = 0
                
                # Positive pairs - should be similar
                for source_idx, target_idx in pos_batch:
                    similarity = F.cosine_similarity(
                        embeddings[source_idx].unsqueeze(0),
                        embeddings[target_idx].unsqueeze(0)
                    )
                    loss += (1 - similarity).mean()
                    
                # Negative pairs - should be dissimilar
                for source_idx, target_idx in neg_batch:
                    similarity = F.cosine_similarity(
                        embeddings[source_idx].unsqueeze(0),
                        embeddings[target_idx].unsqueeze(0)
                    )
                    loss += similarity.mean()
                    
                if loss > 0:
                    # Backward pass
                    optimizer.zero_grad()
                    loss.backward()
                    optimizer.step()
                    
            self.base_recommender.model.eval()
            logger.info(f"Fine-tuned model with {len(positive_pairs)} positive and {len(negative_pairs)} negative pairs")
            
        except Exception as e:
            logger.error(f"Error fine-tuning model: {e}")
            
    def get_learning_stats(self) -> Dict:
        """Get real-time learning statistics"""
        return {
            **self.stats,
            'buffer_size': len(self.interaction_buffer),
            'pending_edge_updates': len(self.edge_update_buffer),
            'pending_feature_updates': sum(
                len(updates) for updates in self.node_feature_updates.values()
            )
        }
        
    def export_learned_graph(self, filepath: str):
        """Export the updated graph structure"""
        if not self.base_recommender.graph_data:
            return False
            
        try:
            graph_data = {
                'edge_index': self.base_recommender.graph_data.edge_index.tolist(),
                'num_nodes': self.base_recommender.graph_data.x.shape[0],
                'num_edges': self.base_recommender.graph_data.edge_index.shape[1],
                'stats': self.stats,
                'timestamp': datetime.now().isoformat()
            }
            
            with open(filepath, 'w') as f:
                json.dump(graph_data, f, indent=2)
                
            logger.info(f"Exported learned graph to {filepath}")
            return True
            
        except Exception as e:
            logger.error(f"Error exporting graph: {e}")
            return False