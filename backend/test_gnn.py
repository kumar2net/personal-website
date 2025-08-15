#!/usr/bin/env python3
"""
Test script for the Neural Graph Recommender MVP
Run this to verify the system works with your existing blog data
"""

import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from graph_recommender import NeuralGraphRecommenderMVP

def test_gnn_mvp():
    """Test the GNN MVP functionality"""
    print("🧠 Testing Neural Graph Recommender MVP")
    print("=" * 50)
    
    # Paths to your existing semantic data
    semantic_mapping_path = "../src/data/semantic-mapping.json"
    semantic_embeddings_path = "../src/data/semantic-embeddings.json"
    
    print(f"📂 Checking data files...")
    if not os.path.exists(semantic_mapping_path):
        print(f"❌ Semantic mapping file not found: {semantic_mapping_path}")
        return False
    if not os.path.exists(semantic_embeddings_path):
        print(f"❌ Semantic embeddings file not found: {semantic_embeddings_path}")
        return False
    
    print(f"✅ Data files found")
    
    # Initialize the recommender
    print(f"\n🔧 Initializing Neural Graph Recommender...")
    recommender = NeuralGraphRecommenderMVP(
        semantic_mapping_path=semantic_mapping_path,
        semantic_embeddings_path=semantic_embeddings_path
    )
    
    success = recommender.initialize()
    if not success:
        print("❌ Failed to initialize recommender")
        return False
    
    print("✅ Recommender initialized successfully!")
    
    # Get graph statistics
    print(f"\n📊 Graph Statistics:")
    print(f"   Posts: {len(recommender.graph_builder.posts)}")
    print(f"   Tags: {len(recommender.graph_builder.tag_to_idx)}")
    print(f"   Total nodes: {recommender.graph_data.x.shape[0]}")
    print(f"   Total edges: {recommender.graph_data.edge_index.shape[1]}")
    print(f"   Node features dim: {recommender.graph_data.x.shape[1]}")
    
    # Show available posts
    print(f"\n📝 Available Posts:")
    for i, post in enumerate(recommender.graph_builder.posts[:5]):  # Show first 5
        print(f"   {i+1}. {post['id']} - {post.get('title', 'No title')[:60]}...")
    if len(recommender.graph_builder.posts) > 5:
        print(f"   ... and {len(recommender.graph_builder.posts) - 5} more")
    
    # Test recommendations for a few posts
    print(f"\n🎯 Testing Recommendations:")
    test_posts = list(recommender.graph_builder.post_to_idx.keys())[:3]  # Test first 3 posts
    
    for post_id in test_posts:
        print(f"\n   Testing recommendations for: {post_id}")
        recommendations = recommender.get_recommendations(post_id, num_recommendations=3)
        
        if recommendations:
            print(f"   ✅ Found {len(recommendations)} recommendations:")
            for j, rec in enumerate(recommendations):
                print(f"      {j+1}. {rec['title'][:50]}... (Score: {rec['score']:.3f})")
        else:
            print(f"   ⚠️  No recommendations found")
    
    # Test trending posts
    print(f"\n🔥 Testing Trending Posts:")
    trending = recommender.get_all_posts_with_scores()
    if trending:
        print(f"   ✅ Found {len(trending)} posts with centrality scores")
        print(f"   Top 3 trending posts:")
        for i, post in enumerate(trending[:3]):
            print(f"      {i+1}. {post['title'][:50]}... (Score: {post['centrality_score']:.3f})")
    else:
        print(f"   ⚠️  No trending posts found")
    
    # Show extracted tags
    print(f"\n🏷️  Extracted Tags:")
    tags = list(recommender.graph_builder.tag_to_idx.keys())
    print(f"   Found {len(tags)} tags: {', '.join(tags[:10])}")
    if len(tags) > 10:
        print(f"   ... and {len(tags) - 10} more")
    
    print(f"\n✅ Neural Graph Recommender MVP test completed successfully!")
    print(f"🚀 Ready to serve recommendations via FastAPI!")
    
    return True

if __name__ == "__main__":
    success = test_gnn_mvp()
    sys.exit(0 if success else 1)