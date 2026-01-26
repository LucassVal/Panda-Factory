//! 🔧 MCP Server Module
//! ====================
//! Model Context Protocol server for AI tools

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio::io::{self, AsyncBufReadExt, AsyncWriteExt, BufReader};

use crate::crypto;
use crate::gpu;

/// MCP Tool definition
#[derive(Debug, Serialize)]
pub struct Tool {
    pub name: String,
    pub description: String,
    pub input_schema: Value,
}

/// MCP Response
#[derive(Debug, Serialize)]
pub struct McpResponse {
    pub jsonrpc: String,
    pub id: Value,
    pub result: Value,
}

/// MCP Error Response
#[derive(Debug, Serialize)]
pub struct McpError {
    pub jsonrpc: String,
    pub id: Value,
    pub error: McpErrorDetail,
}

#[derive(Debug, Serialize)]
pub struct McpErrorDetail {
    pub code: i32,
    pub message: String,
}

/// Available tools
pub fn get_tools() -> Vec<Tool> {
    vec![
        Tool {
            name: "gpu_info".to_string(),
            description: "Get GPU information (NVIDIA)".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {},
                "required": []
            }),
        },
        Tool {
            name: "sign_message".to_string(),
            description: "Sign a message with Founder Ed25519 key".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "Message to sign"
                    }
                },
                "required": ["message"]
            }),
        },
        Tool {
            name: "verify_signature".to_string(),
            description: "Verify an Ed25519 signature".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {
                    "message": { "type": "string" },
                    "signature": { "type": "string" },
                    "pubkey": { "type": "string" }
                },
                "required": ["message", "signature", "pubkey"]
            }),
        },
        Tool {
            name: "get_public_key".to_string(),
            description: "Get Founder public key".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {},
                "required": []
            }),
        },
    ]
}

/// Handle tool call
pub async fn handle_tool_call(name: &str, args: &Value) -> Result<Value, String> {
    match name {
        "gpu_info" => {
            let info = gpu::detect_gpu();
            Ok(serde_json::to_value(info).unwrap())
        }
        "sign_message" => {
            let message = args["message"]
                .as_str()
                .ok_or("Missing message parameter")?;
            
            let keypair = crypto::load_or_create_keypair()
                .map_err(|e| e.to_string())?;
            
            let signature = keypair.sign(message.as_bytes());
            
            Ok(serde_json::json!({
                "signature": signature,
                "pubkey": keypair.public_key_hex()
            }))
        }
        "verify_signature" => {
            let message = args["message"].as_str().ok_or("Missing message")?;
            let signature = args["signature"].as_str().ok_or("Missing signature")?;
            let pubkey = args["pubkey"].as_str().ok_or("Missing pubkey")?;

            let result = crypto::verify_with_pubkey(pubkey, message.as_bytes(), signature)
                .map_err(|e| e.to_string())?;

            Ok(serde_json::json!({ "valid": result }))
        }
        "get_public_key" => {
            let keypair = crypto::load_or_create_keypair()
                .map_err(|e| e.to_string())?;
            
            Ok(serde_json::json!({
                "pubkey": keypair.public_key_hex()
            }))
        }
        _ => Err(format!("Unknown tool: {}", name)),
    }
}

/// Start MCP server on stdio
pub async fn start_server() -> anyhow::Result<()> {
    let stdin = io::stdin();
    let mut stdout = io::stdout();
    let reader = BufReader::new(stdin);
    let mut lines = reader.lines();

    while let Some(line) = lines.next_line().await? {
        if line.is_empty() {
            continue;
        }

        let request: Value = match serde_json::from_str(&line) {
            Ok(v) => v,
            Err(_) => continue,
        };

        let method = request["method"].as_str().unwrap_or("");
        let id = request["id"].clone();

        let response = match method {
            "initialize" => {
                serde_json::json!({
                    "protocolVersion": "2024-11-05",
                    "capabilities": {
                        "tools": {}
                    },
                    "serverInfo": {
                        "name": "panda-agent",
                        "version": "0.1.0"
                    }
                })
            }
            "tools/list" => {
                let tools = get_tools();
                serde_json::json!({ "tools": tools })
            }
            "tools/call" => {
                let name = request["params"]["name"].as_str().unwrap_or("");
                let args = &request["params"]["arguments"];
                
                match handle_tool_call(name, args).await {
                    Ok(result) => serde_json::json!({
                        "content": [{
                            "type": "text",
                            "text": serde_json::to_string_pretty(&result)?
                        }]
                    }),
                    Err(e) => serde_json::json!({
                        "isError": true,
                        "content": [{
                            "type": "text",
                            "text": e
                        }]
                    }),
                }
            }
            _ => {
                serde_json::json!({
                    "error": {
                        "code": -32601,
                        "message": format!("Unknown method: {}", method)
                    }
                })
            }
        };

        let full_response = McpResponse {
            jsonrpc: "2.0".to_string(),
            id,
            result: response,
        };

        let json = serde_json::to_string(&full_response)?;
        stdout.write_all(json.as_bytes()).await?;
        stdout.write_all(b"\n").await?;
        stdout.flush().await?;
    }

    Ok(())
}
