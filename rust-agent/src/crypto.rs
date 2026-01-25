//! 🔐 Ed25519 Crypto Module
//! =========================
//! Founder signature and verification

use ed25519_dalek::{Signature, Signer, SigningKey, Verifier, VerifyingKey};
use rand::rngs::OsRng;
use std::fs;
use std::path::Path;
use thiserror::Error;

const KEYPAIR_FILE: &str = "panda_founder.key";
const PUBKEY_FILE: &str = "panda_founder.pub";

#[derive(Error, Debug)]
pub enum CryptoError {
    #[error("Failed to read key file: {0}")]
    FileRead(#[from] std::io::Error),
    #[error("Invalid key format")]
    InvalidKey,
    #[error("Signature verification failed")]
    VerificationFailed,
}

/// Wrapper for Ed25519 keypair
pub struct FounderKeypair {
    signing_key: SigningKey,
}

impl FounderKeypair {
    /// Create new random keypair
    pub fn generate() -> Self {
        let mut csprng = OsRng;
        let signing_key = SigningKey::generate(&mut csprng);
        Self { signing_key }
    }

    /// Load from file
    pub fn from_file(path: &Path) -> Result<Self, CryptoError> {
        let bytes = fs::read(path)?;
        let key_bytes: [u8; 32] = bytes
            .try_into()
            .map_err(|_| CryptoError::InvalidKey)?;
        let signing_key = SigningKey::from_bytes(&key_bytes);
        Ok(Self { signing_key })
    }

    /// Save to file
    pub fn save(&self, path: &Path) -> Result<(), CryptoError> {
        fs::write(path, self.signing_key.to_bytes())?;
        Ok(())
    }

    /// Get public key as hex string
    pub fn public_key_hex(&self) -> String {
        hex::encode(self.signing_key.verifying_key().as_bytes())
    }

    /// Get verifying key
    pub fn verifying_key(&self) -> VerifyingKey {
        self.signing_key.verifying_key()
    }

    /// Sign a message
    pub fn sign(&self, message: &[u8]) -> String {
        let signature = self.signing_key.sign(message);
        hex::encode(signature.to_bytes())
    }

    /// Verify a signature
    pub fn verify(&self, message: &[u8], signature_hex: &str) -> Result<bool, CryptoError> {
        let sig_bytes = hex::decode(signature_hex)
            .map_err(|_| CryptoError::InvalidKey)?;
        let sig_array: [u8; 64] = sig_bytes
            .try_into()
            .map_err(|_| CryptoError::InvalidKey)?;
        let signature = Signature::from_bytes(&sig_array);
        
        self.signing_key
            .verifying_key()
            .verify(message, &signature)
            .map(|_| true)
            .map_err(|_| CryptoError::VerificationFailed)
    }
}

/// Load existing keypair or create new one
pub fn load_or_create_keypair() -> Result<FounderKeypair, CryptoError> {
    let key_path = Path::new(KEYPAIR_FILE);
    
    if key_path.exists() {
        tracing::info!("Loading existing Founder keypair");
        FounderKeypair::from_file(key_path)
    } else {
        tracing::info!("Generating new Founder keypair");
        let keypair = FounderKeypair::generate();
        keypair.save(key_path)?;
        
        // Also save public key separately
        let pub_path = Path::new(PUBKEY_FILE);
        fs::write(pub_path, keypair.public_key_hex())?;
        
        Ok(keypair)
    }
}

/// Verify signature with just public key (for frontend validation)
pub fn verify_with_pubkey(
    pubkey_hex: &str,
    message: &[u8],
    signature_hex: &str,
) -> Result<bool, CryptoError> {
    let pubkey_bytes = hex::decode(pubkey_hex)
        .map_err(|_| CryptoError::InvalidKey)?;
    let pubkey_array: [u8; 32] = pubkey_bytes
        .try_into()
        .map_err(|_| CryptoError::InvalidKey)?;
    let verifying_key = VerifyingKey::from_bytes(&pubkey_array)
        .map_err(|_| CryptoError::InvalidKey)?;

    let sig_bytes = hex::decode(signature_hex)
        .map_err(|_| CryptoError::InvalidKey)?;
    let sig_array: [u8; 64] = sig_bytes
        .try_into()
        .map_err(|_| CryptoError::InvalidKey)?;
    let signature = Signature::from_bytes(&sig_array);

    verifying_key
        .verify(message, &signature)
        .map(|_| true)
        .map_err(|_| CryptoError::VerificationFailed)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sign_verify() {
        let keypair = FounderKeypair::generate();
        let message = b"KILL_SWITCH_ACTIVATE";
        
        let signature = keypair.sign(message);
        let result = keypair.verify(message, &signature);
        
        assert!(result.is_ok());
        assert!(result.unwrap());
    }

    #[test]
    fn test_verify_with_pubkey() {
        let keypair = FounderKeypair::generate();
        let pubkey = keypair.public_key_hex();
        let message = b"test message";
        let signature = keypair.sign(message);

        let result = verify_with_pubkey(&pubkey, message, &signature);
        assert!(result.is_ok());
        assert!(result.unwrap());
    }
}
