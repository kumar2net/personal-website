from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import json
from graph_recommender import NeuralGraphRecommenderMVP
from analytics_integration import GA4BehaviorAnalyzer, EnhancedGraphRecommender
from realtime_learning import RealtimeLearningEngine
import asyncio
import threading
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Neural Graph Recommender MVP", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global recommender instances
recommender = None
enhanced_recommender = None
ga4_analyzer = None
realtime_engine = None
initialization_status = {"initialized": False, "error": None, "ga4_enabled": False, "realtime_learning": False}

class RecommendationRequest(BaseModel):
    post_id: str
    num_recommendations: Optional[int] = 5

class RecommendationResponse(BaseModel):
    recommendations: List[Dict]
    post_id: str
    success: bool
    message: Optional[str] = None

class InteractionRequest(BaseModel):
    user_id: Optional[str] = None
    post_id: str
    action: str  # view, click, like, share, skip
    context: Optional[Dict] = None

class StatusResponse(BaseModel):
    initialized: bool
    error: Optional[str] = None
    num_posts: Optional[int] = None
    num_edges: Optional[int] = None
    ga4_enabled: Optional[bool] = False
    features: Optional[List[str]] = None

def initialize_recommender():
    """Initialize the recommender system in background"""
    global recommender, enhanced_recommender, ga4_analyzer, initialization_status
    
    try:
        # Paths to your existing semantic data
        semantic_mapping_path = "../src/data/semantic-mapping.json"
        semantic_embeddings_path = "../src/data/semantic-embeddings.json"
        
        # Check if files exist
        if not os.path.exists(semantic_mapping_path):
            raise FileNotFoundError(f"Semantic mapping file not found: {semantic_mapping_path}")
        if not os.path.exists(semantic_embeddings_path):
            raise FileNotFoundError(f"Semantic embeddings file not found: {semantic_embeddings_path}")
        
        # Initialize base recommender
        recommender = NeuralGraphRecommenderMVP(
            semantic_mapping_path=semantic_mapping_path,
            semantic_embeddings_path=semantic_embeddings_path
        )
        
        success = recommender.initialize()
        
        if success:
            initialization_status = {"initialized": True, "error": None, "ga4_enabled": False}
            logger.info("✅ Neural Graph Recommender MVP initialized successfully!")
            
            # Try to initialize GA4 integration
            try:
                ga4_analyzer = GA4BehaviorAnalyzer()
                enhanced_recommender = EnhancedGraphRecommender(recommender, ga4_analyzer)
                initialization_status["ga4_enabled"] = True
                logger.info("✅ GA4 integration enabled successfully!")
            except Exception as ga4_error:
                logger.warning(f"⚠️ GA4 integration not available: {ga4_error}")
                logger.info("Continuing with base recommender only")
            
            # Initialize real-time learning engine
            try:
                global realtime_engine
                realtime_engine = RealtimeLearningEngine(recommender)
                asyncio.create_task(realtime_engine.start())
                initialization_status["realtime_learning"] = True
                logger.info("✅ Real-time learning engine started successfully!")
            except Exception as rt_error:
                logger.warning(f"⚠️ Real-time learning not available: {rt_error}")
        else:
            initialization_status = {"initialized": False, "error": "Failed to initialize recommender", "ga4_enabled": False}
            logger.error("❌ Failed to initialize Neural Graph Recommender MVP")
            
    except Exception as e:
        initialization_status = {"initialized": False, "error": str(e), "ga4_enabled": False}
        logger.error(f"❌ Error initializing recommender: {e}")

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
        "error": initialization_status["error"],
        "ga4_enabled": initialization_status.get("ga4_enabled", False)
    }
    
    # Add available features
    features = ["graph_recommendations", "trending_posts", "similarity_scoring"]
    if initialization_status.get("ga4_enabled"):
        features.extend(["ga4_engagement", "user_journeys", "enhanced_trending"])
    if initialization_status.get("realtime_learning"):
        features.extend(["realtime_learning", "interaction_tracking", "online_updates"])
    status["features"] = features
    status["realtime_learning"] = initialization_status.get("realtime_learning", False)
    
    if recommender and initialization_status["initialized"]:
        status["num_posts"] = len(recommender.graph_builder.posts)
        if recommender.graph_data:
            status["num_edges"] = recommender.graph_data.edge_index.shape[1]
    
    return StatusResponse(**status)

@app.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """Get GNN-based recommendations for a blog post"""
    global recommender, enhanced_recommender, initialization_status
    
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
        # Use enhanced recommender if GA4 is enabled
        if initialization_status.get("ga4_enabled") and enhanced_recommender:
            recommendations = await enhanced_recommender.get_enhanced_recommendations(
                post_id=request.post_id,
                num_recommendations=request.num_recommendations
            )
            message = f"Found {len(recommendations)} GA4-enhanced recommendations"
        else:
            recommendations = recommender.get_recommendations(
                post_id=request.post_id,
                num_recommendations=request.num_recommendations
            )
            message = f"Found {len(recommendations)} recommendations"
        
        return RecommendationResponse(
            recommendations=recommendations,
            post_id=request.post_id,
            success=True,
            message=message
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
    """Get trending posts based on graph centrality scores and GA4 data"""
    global recommender, enhanced_recommender, initialization_status
    
    if not initialization_status["initialized"]:
        raise HTTPException(status_code=503, detail="Recommender not initialized")
    
    try:
        # Use GA4 trending if available
        if initialization_status.get("ga4_enabled") and enhanced_recommender:
            trending_posts = await enhanced_recommender.get_trending_recommendations(limit=10)
            message = "Found GA4-powered trending posts"
        else:
            trending_posts = recommender.get_all_posts_with_scores()[:10]
            message = f"Found {len(trending_posts)} posts with centrality scores"
        
        return {
            "trending_posts": trending_posts,
            "success": True,
            "message": message
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



@app.post("/interaction")
async def track_interaction(interaction: InteractionRequest):
    """Track user interaction for real-time learning"""
    global realtime_engine, initialization_status
    
    if not initialization_status.get("realtime_learning"):
        # Still track interaction even if real-time learning is disabled
        logger.info(f"Interaction tracked (learning disabled): {interaction.action} on {interaction.post_id}")
        return {
            "success": True,
            "message": "Interaction tracked (real-time learning not enabled)"
        }
    
    try:
        # Record interaction for learning
        realtime_engine.record_interaction({
            "user_id": interaction.user_id or "anonymous",
            "post_id": interaction.post_id,
            "action": interaction.action,
            "context": interaction.context or {}
        })
        
        return {
            "success": True,
            "message": f"Interaction recorded: {interaction.action} on {interaction.post_id}"
        }
        
    except Exception as e:
        logger.error(f"Error tracking interaction: {e}")
        raise HTTPException(status_code=500, detail=f"Error tracking interaction: {str(e)}")

@app.get("/learning/stats")
async def get_learning_stats():
    """Get real-time learning statistics"""
    global realtime_engine, initialization_status
    
    if not initialization_status.get("realtime_learning"):
        return {
            "enabled": False,
            "message": "Real-time learning not enabled"
        }
    
    try:
        stats = realtime_engine.get_learning_stats()
        return {
            "enabled": True,
            "stats": stats,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting learning stats: {str(e)}")

@app.post("/learning/update")
async def trigger_model_update():
    """Manually trigger a model update"""
    global realtime_engine, initialization_status
    
    if not initialization_status.get("realtime_learning"):
        raise HTTPException(
            status_code=503,
            detail="Real-time learning not enabled"
        )
    
    try:
        await realtime_engine.update_model()
        return {
            "success": True,
            "message": "Model update triggered successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating model: {str(e)}")

@app.get("/analytics/engagement")
async def get_engagement_metrics(days: int = 7):
    """Get page engagement metrics from GA4"""
    global ga4_analyzer, initialization_status
    
    if not initialization_status.get("ga4_enabled"):
        raise HTTPException(
            status_code=503,
            detail="GA4 integration is not enabled"
        )
    
    try:
        metrics = await ga4_analyzer.get_page_engagement_metrics(days=days)
        return {
            "engagement_metrics": metrics,
            "days": days,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching engagement metrics: {str(e)}")

@app.get("/analytics/journeys")
async def get_user_journeys(days: int = 7):
    """Get user journey patterns from GA4"""
    global ga4_analyzer, initialization_status
    
    if not initialization_status.get("ga4_enabled"):
        raise HTTPException(
            status_code=503,
            detail="GA4 integration is not enabled"
        )
    
    try:
        journeys = await ga4_analyzer.get_user_journey_patterns(days=days)
        return {
            "journey_patterns": journeys,
            "days": days,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching journey patterns: {str(e)}")

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
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)