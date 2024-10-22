use config::{get_app_config, get_config_path, set_app_config, AppConfig};

mod config;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tokio::main]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    #[cfg(any(target_os = "android", target_os = "ios"))]
    {
        tauri::Builder::default()
            .plugin(tauri_plugin_os::init())
            .plugin(tauri_plugin_process::init())
            .plugin(tauri_plugin_shell::init())
            .plugin(tauri_plugin_updater::Builder::default().build())
            .invoke_handler(tauri::generate_handler![
                greet,
                load_settings,
                save_settings,
            ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    }

    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    {
        tauri::Builder::default()
            .plugin(tauri_plugin_process::init())
            .plugin(tauri_plugin_shell::init())
            .plugin(tauri_plugin_updater::Builder::default().build())
            .plugin(tauri_plugin_os::init())
            .plugin(tauri_plugin_window_state::Builder::default().build())
            .invoke_handler(tauri::generate_handler![
                greet,
                load_settings,
                save_settings,
            ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    }
}

/// Loads the application settings requested by the frontend.
///
/// # Returns
/// Application settings.
#[tauri::command(async)]
async fn load_settings(app_handle: tauri::AppHandle) -> AppConfig {
    let cfg_path = get_config_path(&app_handle).await;
    get_app_config(&cfg_path).await
}

/// Saves the settings passed from the frontend.
///
/// # Arguments
///
/// `config` - the application configuration.
///
/// # Returns
/// `true` if the settings were saved successfully; `false` otherwise.
#[tauri::command(async)]
async fn save_settings(config: AppConfig, app_handle: tauri::AppHandle) -> bool {
    let cfg_path = get_config_path(&app_handle).await;
    set_app_config(&cfg_path, config).await
}
