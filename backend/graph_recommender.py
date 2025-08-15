import json
import os
import numpy as np
import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, global_mean_pool
from torch_geometric.data import Data, Batch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Tuple
import re

class BlogPostGraphBuilder:
    """Builds a graph from blog posts and their relationships"""
    
    def __init__(self, semantic_mapping_path: str, semantic_embeddings_path: str):
        self.semantic_mapping_path = semantic_mapping_path
        self.semantic_embeddings_path = semantic_embeddings_path
        self.posts = []
        self.embeddings = []
        self.post_to_idx = {}
        self.tag_to_idx = {}
        self.idx_to_post = {}
        
    def load_blog_data(self):
        """Load blog posts data from semantic mapping and embeddings"""
        try:
            # Load semantic mapping (post metadata)
            with open(self.semantic_mapping_path, 'r') as f:
                self.posts = json.load(f)
            
            # Load semantic embeddings  
            with open(self.semantic_embeddings_path, 'r') as f:
                self.embeddings = json.load(f)
                
            # Create mappings
            for idx, post in enumerate(self.posts):
                self.post_to_idx[post['id']] = idx
                self.idx_to_post[idx] = post
                
            print(f"Loaded {len(self.posts)} blog posts")
            return True
            
        except FileNotFoundError as e:
            print(f"Error loading blog data: {e}")
            return False
    
    def extract_tags_from_posts(self):
        """Extract and index all unique tags from blog posts"""
        all_tags = set()
        
        # Extract tags from post titles and content (simple keyword extraction)
        for post in self.posts:
            # Simple tag extraction from title and content
            title = post.get('title', '').lower()
            excerpt = post.get('excerpt', '').lower()
            
            # Extract potential tags (simple approach for MVP)
            words = re.findall(r'\b\w+\b', title + ' ' + excerpt)
            tech_keywords = [
                'ai', 'machine learning', 'python', 'javascript', 'react', 'nodejs',
                'data', 'analysis', 'research', 'technology', 'programming', 'web',
                'development', 'software', 'algorithm', 'neural', 'network', 'graph',
                'api', 'database', 'frontend', 'backend', 'ui', 'ux', 'design',
                'india', 'usa', 'trade', 'economy', 'business', 'startup', 'venture',
                'healthcare', 'medical', 'engineering', 'science', 'innovation'
            ]
            
            # Find matching keywords as tags
            post_tags = [word for word in words if word in tech_keywords]
            all_tags.update(post_tags)
            
            # Store tags with post
            post['extracted_tags'] = post_tags
        
        # Create tag index
        for idx, tag in enumerate(sorted(all_tags)):
            self.tag_to_idx[tag] = len(self.posts) + idx
            
        print(f"Extracted {len(all_tags)} unique tags")
        return list(all_tags)
    
    def build_graph(self, similarity_threshold: float = 0.3):
        """Build PyTorch Geometric graph from blog posts"""
        num_posts = len(self.posts)
        num_tags = len(self.tag_to_idx)
        total_nodes = num_posts + num_tags
        
        # Node features
        node_features = []
        
        # Post node features (use embeddings + metadata)
        for i, post in enumerate(self.posts):
            if i < len(self.embeddings):
                embedding = self.embeddings[i]
                # Add simple metadata features
                metadata_features = [
                    len(post.get('title', '')),  # title length
                    len(post.get('excerpt', '')),  # excerpt length  
                    len(post.get('extracted_tags', [])),  # number of tags
                ]
                features = embedding + metadata_features
            else:
                # Fallback for missing embeddings
                features = [0.0] * (768 + 3)
            
            node_features.append(features)
        
        # Tag node features (simple one-hot style)
        for tag in sorted(self.tag_to_idx.keys()):
            # Simple tag features for MVP
            tag_features = [0.0] * 768 + [1.0, 0.0, 1.0]  # marker for tag nodes
            node_features.append(tag_features)
        
        # Convert to tensor
        x = torch.tensor(node_features, dtype=torch.float)
        
        # Build edges
        edge_list = []
        
        # 1. Post-tag edges
        for post_idx, post in enumerate(self.posts):
            for tag in post.get('extracted_tags', []):
                if tag in self.tag_to_idx:
                    tag_idx = self.tag_to_idx[tag]
                    # Bidirectional edges
                    edge_list.append([post_idx, tag_idx])
                    edge_list.append([tag_idx, post_idx])
        
        # 2. Post-post similarity edges (using embeddings)
        if len(self.embeddings) >= 2:
            embeddings_array = np.array(self.embeddings[:num_posts])
            similarity_matrix = cosine_similarity(embeddings_array)
            
            for i in range(num_posts):
                for j in range(i + 1, num_posts):
                    if similarity_matrix[i][j] > similarity_threshold:
                        edge_list.append([i, j])
                        edge_list.append([j, i])
        
        # Convert edges to tensor
        if edge_list:
            edge_index = torch.tensor(edge_list, dtype=torch.long).t().contiguous()
        else:
            # Create minimal graph if no edges found
            edge_index = torch.tensor([[0, 1], [1, 0]], dtype=torch.long).t().contiguous()
        
        # Create PyTorch Geometric Data object
        data = Data(x=x, edge_index=edge_index)
        
        print(f"Built graph with {total_nodes} nodes and {edge_index.shape[1]} edges")
        return data


class SimpleGNNRecommender(torch.nn.Module):
    """Simple GNN model for blog post recommendations"""
    
    def __init__(self, input_dim: int, hidden_dim: int = 128, output_dim: int = 64):
        super(SimpleGNNRecommender, self).__init__()
        
        self.conv1 = GCNConv(input_dim, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.conv3 = GCNConv(hidden_dim, output_dim)
        self.dropout = torch.nn.Dropout(0.2)
        
    def forward(self, x, edge_index, batch=None):
        # First GCN layer
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.dropout(x)
        
        # Second GCN layer
        x = self.conv2(x, edge_index)
        x = F.relu(x)
        x = self.dropout(x)
        
        # Third GCN layer
        x = self.conv3(x, edge_index)
        
        return x


class NeuralGraphRecommenderMVP:
    """Main MVP class for neural graph recommendations"""
    
    def __init__(self, semantic_mapping_path: str, semantic_embeddings_path: str):
        self.graph_builder = BlogPostGraphBuilder(semantic_mapping_path, semantic_embeddings_path)
        self.model = None
        self.graph_data = None
        self.is_initialized = False
        
    def initialize(self):
        """Initialize the recommender system"""
        try:
            # Load blog data
            if not self.graph_builder.load_blog_data():
                return False
            
            # Extract tags
            self.graph_builder.extract_tags_from_posts()
            
            # Build graph
            self.graph_data = self.graph_builder.build_graph()
            
            # Initialize model
            input_dim = self.graph_data.x.shape[1]
            self.model = SimpleGNNRecommender(input_dim)
            
            # Simple unsupervised training (node similarity)
            self._train_model()
            
            self.is_initialized = True
            print("Neural Graph Recommender MVP initialized successfully!")
            return True
            
        except Exception as e:
            print(f"Error initializing recommender: {e}")
            return False
    
    def _train_model(self, epochs: int = 50):
        """Simple unsupervised training for the GNN model"""
        self.model.train()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.01)
        
        for epoch in range(epochs):
            optimizer.zero_grad()
            
            # Forward pass
            embeddings = self.model(self.graph_data.x, self.graph_data.edge_index)
            
            # Simple reconstruction loss (node similarity preservation)
            # For connected nodes, embeddings should be similar
            edge_index = self.graph_data.edge_index
            src_embeddings = embeddings[edge_index[0]]
            dst_embeddings = embeddings[edge_index[1]]
            
            # Cosine similarity loss
            similarity = F.cosine_similarity(src_embeddings, dst_embeddings)
            loss = -similarity.mean()  # Maximize similarity for connected nodes
            
            loss.backward()
            optimizer.step()
            
            if epoch % 10 == 0:
                print(f"Training epoch {epoch}, Loss: {loss.item():.4f}")
    
    def get_recommendations(self, post_id: str, num_recommendations: int = 5) -> List[Dict]:
        """Get recommendations for a given blog post"""
        if not self.is_initialized:
            return []
        
        try:
            # Get post index
            if post_id not in self.graph_builder.post_to_idx:
                return []
            
            post_idx = self.graph_builder.post_to_idx[post_id]
            
            # Get embeddings from trained model
            self.model.eval()
            with torch.no_grad():
                embeddings = self.model(self.graph_data.x, self.graph_data.edge_index)
            
            # Calculate similarities to other posts
            post_embedding = embeddings[post_idx].unsqueeze(0)
            num_posts = len(self.graph_builder.posts)
            post_embeddings = embeddings[:num_posts]
            
            similarities = F.cosine_similarity(post_embedding, post_embeddings)
            
            # Get top recommendations (excluding the input post)
            similarities[post_idx] = -1  # Exclude self
            top_indices = similarities.argsort(descending=True)[:num_recommendations]
            
            # Format recommendations
            recommendations = []
            for idx in top_indices:
                idx_val = idx.item()
                if idx_val < num_posts:  # Ensure it's a post node
                    post = self.graph_builder.idx_to_post[idx_val]
                    recommendations.append({
                        'id': post['id'],
                        'title': post.get('title', 'Untitled'),
                        'url': post.get('url', ''),
                        'excerpt': post.get('excerpt', ''),
                        'score': similarities[idx].item(),
                        'tags': post.get('extracted_tags', [])
                    })
            
            return recommendations
            
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            return []
    
    def get_all_posts_with_scores(self) -> List[Dict]:
        """Get all posts with their centrality scores for trending analysis"""
        if not self.is_initialized:
            return []
        
        try:
            self.model.eval()
            with torch.no_grad():
                embeddings = self.model(self.graph_data.x, self.graph_data.edge_index)
            
            # Calculate node centrality (simple approach: embedding magnitude)
            num_posts = len(self.graph_builder.posts)
            post_embeddings = embeddings[:num_posts]
            centrality_scores = torch.norm(post_embeddings, dim=1)
            
            posts_with_scores = []
            for idx, post in enumerate(self.graph_builder.posts):
                posts_with_scores.append({
                    'id': post['id'],
                    'title': post.get('title', 'Untitled'),
                    'url': post.get('url', ''),
                    'excerpt': post.get('excerpt', ''),
                    'centrality_score': centrality_scores[idx].item(),
                    'tags': post.get('extracted_tags', [])
                })
            
            # Sort by centrality score
            posts_with_scores.sort(key=lambda x: x['centrality_score'], reverse=True)
            return posts_with_scores
            
        except Exception as e:
            print(f"Error getting post scores: {e}")
            return []