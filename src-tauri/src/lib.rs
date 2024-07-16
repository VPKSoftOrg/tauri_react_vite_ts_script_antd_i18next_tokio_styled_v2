use config::{get_app_config, set_app_config, AppConfig};
use rust_i18n::t;
mod config;

#[macro_use]
extern crate rust_i18n;

i18n!();

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    let msg = t!("messages.updateCheckFailedFile", error = name).into_owned();
    msg
    // format!("Hello, {}! You've been greeted from Rust!", name)
}

fn my_error(file_name: &str) -> String {
    let msg = t!("messages.updateCheckFailedFile", error = file_name).into_owned();
    msg
}

#[tokio::main]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            load_settings,
            save_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Loads the application settings requested by the frontend.
///
/// # Returns
/// Application settings.
#[tauri::command]
async fn load_settings() -> AppConfig {
    get_app_config()
}

/// Saves the settings passed from the frontend.
///
/// # Arguments
///
/// `config` - the application configuration.
///
/// # Returns
/// `true` if the settings were saved successfully; `false` otherwise.
#[tauri::command]
async fn save_settings(config: AppConfig) -> bool {
    set_app_config(config)
}
