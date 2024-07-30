use std::{fs, path::PathBuf};

use serde_derive::{Deserialize, Serialize};
use tauri::Manager;

/// The software settings.
#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    /// The current application locale used by the i18next library
    locale: String,
    /// A value indicating whether the plugin-window-state should be used to remember the previous window state.
    save_window_state: bool,
    /// A value indicating whether to use dark mode with the application.
    dark_mode: bool,
    /// A value indicating whether a load error occurred.
    error: bool,
    /// An error message if one occurred.
    error_message: String,
}

// The default value for the application configuration.
impl ::std::default::Default for AppConfig {
    fn default() -> Self {
        Self {
            locale: "en".to_string(),
            save_window_state: false,
            error: false,
            error_message: "".to_string(),
            dark_mode: false,
        }
    }
}

impl AppConfig {
    /// Creates a new AppConfig with the given error message and config path.
    /// # Arguments
    ///
    /// * `emsg` - The error message
    /// * `cfg_path` - The config path
    ///
    /// # Returns
    /// An AppConfig value
    pub fn error(emsg: &String, cfg_path: &str) -> Self {
        Self {
            error_message: format!("{}: '{}'", emsg, cfg_path),
            error: true,
            locale: "en".to_string(),
            save_window_state: false,
            dark_mode: false,
        }
    }
}

/// Gets the application config from a file or default if one doesn't exist.
/// # Arguments
/// * `app_handle` - The tauri application handle
///
/// # Returns
/// An AppConfig value
pub fn get_app_config(cfg_path: &str) -> AppConfig {
    if !PathBuf::from(cfg_path).exists() {
        let success = set_app_config(cfg_path, AppConfig::default());
        if !success {
            return AppConfig::error(&String::from("Failed to save default config"), cfg_path);
        }
    }

    let result = match fs::read(cfg_path) {
        Ok(v) => {
            // The vector to string
            let result = match String::from_utf8(v) {
                Ok(v) => {
                    let config: AppConfig = match serde_json::from_str(v.as_str()) {
                        Ok(v) => v,
                        Err(e) => AppConfig::error(&e.to_string(), cfg_path),
                    };
                    config
                }
                Err(e) => AppConfig::error(&e.to_string(), cfg_path),
            };
            result
        }
        Err(e) => {
            let result = AppConfig::error(&e.to_string(), cfg_path);
            result
        }
    };

    result
}

/// Saves the application config to a settings file using confy. The file format is TOML.
/// # Arguments
///
/// * `app_handle` - The tauri application handle
/// * `config` - the application configuration value.
///
/// # Returns
/// `true` if the config was successfully saved; `false` otherwise.
pub fn set_app_config(cfg_path: &str, config: AppConfig) -> bool {
    let result = match serde_json::to_string(&config) {
        Ok(v) => {
            let result = match fs::write(cfg_path, v) {
                Ok(_) => true,
                Err(_) => false,
            };
            result
        }
        Err(_) => false,
    };
    result
}

/// Gets the application config path.
///
/// # Arguments
///
/// * `app_handle` - The tauri application handle
///
/// # Returns
/// The application config path
pub fn get_config_path(app_handle: &tauri::AppHandle) -> String {
    let binding = match app_handle.path().app_config_dir() {
        Ok(mut v) => {
            if !v.exists() {
                match fs::create_dir_all(&v) {
                    Ok(_) => {}
                    Err(_) => {}
                }
            }
            v.push("config.json");
            v
        }
        Err(_) => {
            return "".to_string();
        }
    };

    let app_data_dir = match binding.to_str() {
        Some(v) => v,
        None => {
            return "".to_string();
        }
    };

    app_data_dir.to_string()
}
