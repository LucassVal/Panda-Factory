//! Moltbook API Client for Panda Hook Master
//! 
//! Social network for AI agents integration.
//! API Base: https://www.moltbook.com/api/v1

use anyhow::{anyhow, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tracing::{info, warn, debug};

const BASE_URL: &str = "https://www.moltbook.com/api/v1";

// ═══════════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MoltbookConfig {
    pub agent_name: String,
    pub api_key: String,
    pub profile_url: String,
    #[serde(default)]
    pub claim_url: Option<String>,
    #[serde(default)]
    pub verification_code: Option<String>,
    #[serde(default)]
    pub status: String,
}

impl MoltbookConfig {
    /// Load config from credentials.json
    pub fn load() -> Result<Self> {
        let path = Self::config_path()?;
        let content = std::fs::read_to_string(&path)
            .map_err(|e| anyhow!("Failed to read credentials: {} - {}", path.display(), e))?;
        let config: Self = serde_json::from_str(&content)?;
        Ok(config)
    }

    /// Save config to credentials.json
    pub fn save(&self) -> Result<()> {
        let path = Self::config_path()?;
        let content = serde_json::to_string_pretty(self)?;
        std::fs::write(&path, content)?;
        Ok(())
    }

    fn config_path() -> Result<PathBuf> {
        // Look for moltbook/credentials.json relative to current dir
        let paths = vec![
            PathBuf::from("../moltbook/credentials.json"),
            PathBuf::from("moltbook/credentials.json"),
            PathBuf::from("../../moltbook/credentials.json"),
        ];
        
        for path in &paths {
            if path.exists() {
                return Ok(path.clone());
            }
        }
        
        // Default path
        Ok(PathBuf::from("../moltbook/credentials.json"))
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// API Types
// ═══════════════════════════════════════════════════════════════════════════

#[derive(Debug, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    #[serde(flatten)]
    pub data: Option<T>,
    pub error: Option<String>,
    pub hint: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ClaimStatus {
    pub status: String, // "pending_claim" or "claimed"
}

#[derive(Debug, Deserialize)]
pub struct AgentProfile {
    pub name: String,
    pub description: Option<String>,
    pub karma: i32,
    pub follower_count: i32,
    pub following_count: i32,
    pub is_claimed: bool,
    pub is_active: bool,
}

#[derive(Debug, Serialize)]
pub struct CreatePostRequest {
    pub submolt: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct Post {
    pub id: String,
    pub title: String,
    pub content: Option<String>,
    pub url: Option<String>,
    pub upvotes: i32,
    pub downvotes: i32,
    pub comment_count: i32,
    pub created_at: String,
    pub author: PostAuthor,
    pub submolt: PostSubmolt,
}

#[derive(Debug, Deserialize)]
pub struct PostAuthor {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct PostSubmolt {
    pub name: String,
    pub display_name: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct FeedResponse {
    pub posts: Vec<Post>,
    pub count: i32,
}

#[derive(Debug, Deserialize)]
pub struct DmCheck {
    pub has_activity: bool,
    pub summary: Option<String>,
    pub requests: Option<DmRequests>,
    pub messages: Option<DmMessages>,
}

#[derive(Debug, Deserialize)]
pub struct DmRequests {
    pub count: i32,
}

#[derive(Debug, Deserialize)]
pub struct DmMessages {
    pub total_unread: i32,
    pub conversations_with_unread: i32,
}

#[derive(Debug)]
pub struct HeartbeatResult {
    pub status: String,
    pub feed_count: i32,
    pub dm_activity: bool,
    pub dm_summary: Option<String>,
}

// ═══════════════════════════════════════════════════════════════════════════
// Client
// ═══════════════════════════════════════════════════════════════════════════

pub struct MoltbookClient {
    config: MoltbookConfig,
    http: Client,
}

impl MoltbookClient {
    /// Create a new client from saved credentials
    pub fn new() -> Result<Self> {
        let config = MoltbookConfig::load()?;
        let http = Client::builder()
            .user_agent("PandaHookMaster/1.0")
            .build()?;
        
        info!("🦞 Moltbook client initialized for: {}", config.agent_name);
        Ok(Self { config, http })
    }

    /// Create client with explicit config
    pub fn with_config(config: MoltbookConfig) -> Result<Self> {
        let http = Client::builder()
            .user_agent("PandaHookMaster/1.0")
            .build()?;
        Ok(Self { config, http })
    }

    // ─────────────────────────────────────────────────────────────────────
    // Authentication & Status
    // ─────────────────────────────────────────────────────────────────────

    /// Check if agent is claimed
    pub async fn check_status(&self) -> Result<ClaimStatus> {
        let resp = self.get("/agents/status").await?;
        let status: ClaimStatus = serde_json::from_value(resp)?;
        Ok(status)
    }

    /// Get own profile
    pub async fn me(&self) -> Result<AgentProfile> {
        let resp = self.get("/agents/me").await?;
        let profile: AgentProfile = serde_json::from_value(resp)?;
        Ok(profile)
    }

    // ─────────────────────────────────────────────────────────────────────
    // Posts
    // ─────────────────────────────────────────────────────────────────────

    /// Create a new post
    pub async fn create_post(&self, submolt: &str, title: &str, content: &str) -> Result<Post> {
        let req = CreatePostRequest {
            submolt: submolt.to_string(),
            title: title.to_string(),
            content: Some(content.to_string()),
            url: None,
        };
        let resp = self.post("/posts", &req).await?;
        let post: Post = serde_json::from_value(resp)?;
        info!("📝 Posted: {} in m/{}", title, submolt);
        Ok(post)
    }

    /// Create a link post
    pub async fn create_link_post(&self, submolt: &str, title: &str, url: &str) -> Result<Post> {
        let req = CreatePostRequest {
            submolt: submolt.to_string(),
            title: title.to_string(),
            content: None,
            url: Some(url.to_string()),
        };
        let resp = self.post("/posts", &req).await?;
        let post: Post = serde_json::from_value(resp)?;
        Ok(post)
    }

    /// Get feed (hot, new, top, rising)
    pub async fn get_feed(&self, sort: &str, limit: u32) -> Result<Vec<Post>> {
        let path = format!("/posts?sort={}&limit={}", sort, limit);
        let resp = self.get(&path).await?;
        
        // Handle both direct array and wrapped response
        if let Ok(posts) = serde_json::from_value::<Vec<Post>>(resp.clone()) {
            return Ok(posts);
        }
        
        let feed: FeedResponse = serde_json::from_value(resp)?;
        Ok(feed.posts)
    }

    /// Upvote a post
    pub async fn upvote(&self, post_id: &str) -> Result<()> {
        let path = format!("/posts/{}/upvote", post_id);
        self.post_empty(&path).await?;
        debug!("👍 Upvoted post {}", post_id);
        Ok(())
    }

    /// Downvote a post
    pub async fn downvote(&self, post_id: &str) -> Result<()> {
        let path = format!("/posts/{}/downvote", post_id);
        self.post_empty(&path).await?;
        Ok(())
    }

    // ─────────────────────────────────────────────────────────────────────
    // Comments
    // ─────────────────────────────────────────────────────────────────────

    /// Add a comment to a post
    pub async fn add_comment(&self, post_id: &str, content: &str) -> Result<serde_json::Value> {
        let path = format!("/posts/{}/comments", post_id);
        let body = serde_json::json!({ "content": content });
        let resp = self.post(&path, &body).await?;
        info!("💬 Commented on post {}", post_id);
        Ok(resp)
    }

    /// Reply to a comment
    pub async fn reply_comment(&self, post_id: &str, parent_id: &str, content: &str) -> Result<serde_json::Value> {
        let path = format!("/posts/{}/comments", post_id);
        let body = serde_json::json!({ 
            "content": content,
            "parent_id": parent_id 
        });
        let resp = self.post(&path, &body).await?;
        Ok(resp)
    }

    // ─────────────────────────────────────────────────────────────────────
    // DMs (Direct Messages)
    // ─────────────────────────────────────────────────────────────────────

    /// Check for DM activity
    pub async fn check_dms(&self) -> Result<DmCheck> {
        let resp = self.get("/agents/dm/check").await?;
        let check: DmCheck = serde_json::from_value(resp)?;
        Ok(check)
    }

    /// Send a DM request to another agent
    pub async fn send_dm_request(&self, to: &str, message: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({
            "to": to,
            "message": message
        });
        let resp = self.post("/agents/dm/request", &body).await?;
        Ok(resp)
    }

    /// Send a message in an existing conversation
    pub async fn send_dm(&self, conversation_id: &str, message: &str) -> Result<serde_json::Value> {
        let path = format!("/agents/dm/conversations/{}/send", conversation_id);
        let body = serde_json::json!({ "message": message });
        let resp = self.post(&path, &body).await?;
        Ok(resp)
    }

    // ─────────────────────────────────────────────────────────────────────
    // Submolts (Communities)
    // ─────────────────────────────────────────────────────────────────────

    /// List all submolts
    pub async fn list_submolts(&self) -> Result<serde_json::Value> {
        self.get("/submolts").await
    }

    /// Subscribe to a submolt
    pub async fn subscribe(&self, submolt: &str) -> Result<()> {
        let path = format!("/submolts/{}/subscribe", submolt);
        self.post_empty(&path).await?;
        info!("📌 Subscribed to m/{}", submolt);
        Ok(())
    }

    // ─────────────────────────────────────────────────────────────────────
    // Search
    // ─────────────────────────────────────────────────────────────────────

    /// Semantic search
    pub async fn search(&self, query: &str, limit: u32) -> Result<serde_json::Value> {
        let encoded = urlencoding::encode(query);
        let path = format!("/search?q={}&limit={}", encoded, limit);
        self.get(&path).await
    }

    // ─────────────────────────────────────────────────────────────────────
    // Heartbeat
    // ─────────────────────────────────────────────────────────────────────

    /// Run a full heartbeat check
    pub async fn heartbeat(&self) -> Result<HeartbeatResult> {
        info!("💓 Running Moltbook heartbeat...");

        // 1. Check claim status
        let status = self.check_status().await?;
        
        if status.status == "pending_claim" {
            warn!("⚠️ Agent not claimed yet! Visit the claim URL to activate.");
            return Ok(HeartbeatResult {
                status: "pending_claim".to_string(),
                feed_count: 0,
                dm_activity: false,
                dm_summary: None,
            });
        }

        // 2. Check DMs
        let dms = self.check_dms().await?;
        
        if dms.has_activity {
            if let Some(ref summary) = dms.summary {
                info!("📬 DM Activity: {}", summary);
            }
        }

        // 3. Check feed
        let feed = self.get_feed("new", 10).await?;
        debug!("📰 Feed has {} new posts", feed.len());

        Ok(HeartbeatResult {
            status: "claimed".to_string(),
            feed_count: feed.len() as i32,
            dm_activity: dms.has_activity,
            dm_summary: dms.summary,
        })
    }

    // ─────────────────────────────────────────────────────────────────────
    // HTTP Helpers
    // ─────────────────────────────────────────────────────────────────────

    async fn get(&self, path: &str) -> Result<serde_json::Value> {
        let url = format!("{}{}", BASE_URL, path);
        let resp = self.http
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .send()
            .await?;
        
        let status = resp.status();
        let body = resp.text().await?;
        
        if !status.is_success() {
            return Err(anyhow!("API error {}: {}", status, body));
        }
        
        let json: serde_json::Value = serde_json::from_str(&body)?;
        
        // Check for API-level errors
        if let Some(false) = json.get("success").and_then(|v| v.as_bool()) {
            let error = json.get("error").and_then(|v| v.as_str()).unwrap_or("Unknown error");
            return Err(anyhow!("Moltbook error: {}", error));
        }
        
        Ok(json)
    }

    async fn post<T: Serialize>(&self, path: &str, body: &T) -> Result<serde_json::Value> {
        let url = format!("{}{}", BASE_URL, path);
        let resp = self.http
            .post(&url)
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .header("Content-Type", "application/json")
            .json(body)
            .send()
            .await?;
        
        let status = resp.status();
        let body_text = resp.text().await?;
        
        if !status.is_success() {
            return Err(anyhow!("API error {}: {}", status, body_text));
        }
        
        let json: serde_json::Value = serde_json::from_str(&body_text)?;
        Ok(json)
    }

    async fn post_empty(&self, path: &str) -> Result<serde_json::Value> {
        let url = format!("{}{}", BASE_URL, path);
        let resp = self.http
            .post(&url)
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .send()
            .await?;
        
        let status = resp.status();
        let body = resp.text().await?;
        
        if !status.is_success() {
            return Err(anyhow!("API error {}: {}", status, body));
        }
        
        let json: serde_json::Value = serde_json::from_str(&body)?;
        Ok(json)
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI Commands
// ═══════════════════════════════════════════════════════════════════════════

/// Run moltbook CLI command
pub async fn run_command(args: &[String]) -> Result<()> {
    if args.is_empty() {
        println!("🦞 Moltbook Commands:");
        println!("  status    - Check claim status");
        println!("  heartbeat - Run heartbeat check");
        println!("  feed      - Show latest posts");
        println!("  post      - Create a new post");
        println!("  profile   - Show your profile");
        return Ok(());
    }

    let client = MoltbookClient::new()?;
    
    match args[0].as_str() {
        "status" => {
            let status = client.check_status().await?;
            println!("📊 Status: {}", status.status);
            if status.status == "pending_claim" {
                println!("⚠️ Please claim your agent by tweeting the verification code!");
            }
        }
        "heartbeat" => {
            let result = client.heartbeat().await?;
            println!("💓 Heartbeat Result:");
            println!("   Status: {}", result.status);
            println!("   Feed posts: {}", result.feed_count);
            println!("   DM activity: {}", result.dm_activity);
            if let Some(summary) = result.dm_summary {
                println!("   DM summary: {}", summary);
            }
        }
        "feed" => {
            let posts = client.get_feed("hot", 10).await?;
            println!("📰 Latest Posts ({} found):", posts.len());
            for post in posts.iter().take(5) {
                println!("   • [{}] {} by @{}", 
                    post.submolt.name, 
                    post.title, 
                    post.author.name
                );
            }
        }
        "profile" => {
            let profile = client.me().await?;
            println!("🐼 Profile: {}", profile.name);
            println!("   Karma: {}", profile.karma);
            println!("   Followers: {}", profile.follower_count);
            println!("   Following: {}", profile.following_count);
            println!("   Claimed: {}", profile.is_claimed);
        }
        "post" => {
            if args.len() < 4 {
                println!("Usage: post <submolt> <title> <content>");
                return Ok(());
            }
            let submolt = &args[1];
            let title = &args[2];
            let content = args[3..].join(" ");
            let post = client.create_post(submolt, title, &content).await?;
            println!("✅ Posted! ID: {}", post.id);
        }
        _ => {
            println!("Unknown command: {}", args[0]);
        }
    }
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_parse() {
        let json = r#"{
            "agent_name": "PandaHookMaster",
            "api_key": "test_key",
            "profile_url": "https://moltbook.com/u/PandaHookMaster",
            "status": "pending_claim"
        }"#;
        
        let config: MoltbookConfig = serde_json::from_str(json).unwrap();
        assert_eq!(config.agent_name, "PandaHookMaster");
    }
}
