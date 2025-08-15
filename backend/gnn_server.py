from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import json
from graph_recommender import NeuralGraphRecommenderMVP
import asyncio
import threading
import time

app = FastAPI(title="Neural Graph Recommender MVP", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global recommender instance
recommender = None
initialization_status = {"initialized": False, "error": None}

class RecommendationRequest(BaseModel):
    post_id: str
    num_recommendations: Optional[int] = 5

class RecommendationResponse(BaseModel):
    recommendations: List[Dict]
    post_id: str
    success: bool
    message: Optional[str] = None

class StatusResponse(BaseModel):
    initialized: bool
    error: Optional[str] = None
    num_posts: Optional[int] = None
    num_edges: Optional[int] = None

def initialize_recommender():
    """Initialize the recommender system in background"""
    global recommender, initialization_status
    
    try:
        # Paths to your existing semantic data
        semantic_mapping_path = "../src/data/semantic-mapping.json"
        semantic_embeddings_path = "../src/data/semantic-embeddings.json"
        
        # Check if files exist
        if not os.path.exists(semantic_mapping_path):
            raise FileNotFoundError(f"Semantic mapping file not found: {semantic_mapping_path}")
        if not os.path.exists(semantic_embeddings_path):
            raise FileNotFoundError(f"Semantic embeddings file not found: {semantic_embeddings_path}")
        
        recommender = NeuralGraphRecommenderMVP(
            semantic_mapping_path=semantic_mapping_path,
            semantic_embeddings_path=semantic_embeddings_path
        )
        
        success = recommender.initialize()
        
        if success:
            initialization_status = {"initialized": True, "error": None}
            print("✅ Neural Graph Recommender MVP initialized successfully!")
        else:
            initialization_status = {"initialized": False, "error": "Failed to initialize recommender"}
            print("❌ Failed to initialize Neural Graph Recommender MVP")
            
    except Exception as e:
        initialization_status = {"initialized": False, "error": str(e)}
        print(f"❌ Error initializing recommender: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize recommender on startup"""
    # Run initialization in a separate thread to avoid blocking
    threading.Thread(target=initialize_recommender, daemon=True).start()

@app.get("/")
async def root():
    return {"message": "Neural Graph Recommender MVP", "version": "1.0.0"}

@app.get("/status", response_model=StatusResponse)
async def get_status():
    """Get initialization status and system info"""
    global recommender, initialization_status
    
    status = {
        "initialized": initialization_status["initialized"],
        "error": initialization_status["error"]
    }
    
    if recommender and initialization_status["initialized"]:
        status["num_posts"] = len(recommender.graph_builder.posts)
        if recommender.graph_data:
            status["num_edges"] = recommender.graph_data.edge_index.shape[1]
    
    return StatusResponse(**status)

@app.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """Get GNN-based recommendations for a blog post"""
    global recommender, initialization_status
    
    # Check if recommender is initialized
    if not initialization_status["initialized"]:
        if initialization_status["error"]:
            raise HTTPException(
                status_code=503,
                detail=f"Recommender not initialized: {initialization_status['error']}"
            )
        else:
            raise HTTPException(
                status_code=503,
                detail="Recommender is still initializing. Please try again in a moment."
            )
    
    try:
        recommendations = recommender.get_recommendations(
            post_id=request.post_id,
            num_recommendations=request.num_recommendations
        )
        
        return RecommendationResponse(
            recommendations=recommendations,
            post_id=request.post_id,
            success=True,
            message=f"Found {len(recommendations)} recommendations"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

@app.get("/recommendations/{post_id}")
async def get_recommendations_get(post_id: str, num_recommendations: int = 5):
    """GET endpoint for recommendations (alternative to POST)"""
    request = RecommendationRequest(
        post_id=post_id,
        num_recommendations=num_recommendations
    )
    return await get_recommendations(request)

@app.get("/trending")
async def get_trending_posts():
    """Get trending posts based on graph centrality scores"""
    global recommender, initialization_status
    
    if not initialization_status["initialized"]:
        raise HTTPException(status_code=503, detail="Recommender not initialized")
    
    try:
        trending_posts = recommender.get_all_posts_with_scores()
        return {
            "trending_posts": trending_posts[:10],  # Top 10
            "success": True,
            "message": f"Found {len(trending_posts)} posts with centrality scores"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting trending posts: {str(e)}")

@app.get("/posts")
async def get_all_posts():
    """Get all blog posts with metadata"""
    global recommender, initialization_status
    
    if not initialization_status["initialized"]:
        raise HTTPException(status_code=503, detail="Recommender not initialized")
    
    try:
        posts = []
        for post in recommender.graph_builder.posts:
            posts.append({
                'id': post['id'],
                'title': post.get('title', 'Untitled'),
                'url': post.get('url', ''),
                'excerpt': post.get('excerpt', ''),
                'tags': post.get('extracted_tags', [])
            })
        
        return {
            "posts": posts,
            "success": True,
            "message": f"Retrieved {len(posts)} blog posts"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting posts: {str(e)}")

@app.get("/graph/stats")
async def get_graph_stats():
    """Get graph statistics"""
    global recommender, initialization_status
    
    if not initialization_status["initialized"]:
        raise HTTPException(status_code=503, detail="Recommender not initialized")
    
    try:
        stats = {
            "num_posts": len(recommender.graph_builder.posts),
            "num_tags": len(recommender.graph_builder.tag_to_idx),
            "total_nodes": recommender.graph_data.x.shape[0],
            "total_edges": recommender.graph_data.edge_index.shape[1],
            "node_features_dim": recommender.graph_data.x.shape[1],
            "tags": list(recommender.graph_builder.tag_to_idx.keys())
        }
        
        return {
            "stats": stats,
            "success": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting graph stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)