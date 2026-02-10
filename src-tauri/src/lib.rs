use std::os::windows::process::CommandExt;
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, State,
};

// Global cancel flag shared between execute and cancel commands
struct AppState {
    cancel_flag: Arc<AtomicBool>,
}

#[tauri::command]
async fn execute_system_command(
    action: String,
    seconds: u64,
    state: State<'_, AppState>,
) -> Result<(), String> {
    // Reset cancel flag
    state.cancel_flag.store(false, Ordering::SeqCst);
    let cancel_flag = state.cancel_flag.clone();

    std::thread::spawn(move || {
        // Wait for the exact number of seconds, checking cancel flag every 100ms
        let total_ms = seconds * 1000;
        let mut elapsed = 0u64;
        while elapsed < total_ms {
            if cancel_flag.load(Ordering::SeqCst) {
                // Cancelled! Exit thread without executing.
                return;
            }
            std::thread::sleep(Duration::from_millis(100));
            elapsed += 100;
        }

        // Final cancel check
        if cancel_flag.load(Ordering::SeqCst) {
            return;
        }

        // Execute the action directly
        let _ = match action.as_str() {
            "shutdown" => Command::new("C:\\Windows\\System32\\shutdown.exe")
                .creation_flags(0x08000000)
                .args(&["/s", "/f", "/t", "0"])
                .spawn(),
            "restart" => Command::new("C:\\Windows\\System32\\shutdown.exe")
                .creation_flags(0x08000000)
                .args(&["/r", "/f", "/t", "0"])
                .spawn(),
            "sleep" => Command::new("C:\\Windows\\System32\\rundll32.exe")
                .creation_flags(0x08000000)
                .args(&["powrprof.dll,SetSuspendState", "0,1,0"])
                .spawn(),
            "lock" => Command::new("C:\\Windows\\System32\\rundll32.exe")
                .creation_flags(0x08000000)
                .args(&["user32.dll,LockWorkStation"])
                .spawn(),
            "logoff" => Command::new("C:\\Windows\\System32\\shutdown.exe")
                .creation_flags(0x08000000)
                .args(&["/l"])
                .spawn(),
            _ => return,
        };
    });

    Ok(())
}

#[tauri::command]
async fn cancel_schedule(state: State<'_, AppState>) -> Result<(), String> {
    // Set cancel flag - the running thread will see this and stop
    state.cancel_flag.store(true, Ordering::SeqCst);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            cancel_flag: Arc::new(AtomicBool::new(false)),
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Çıkış", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Göster", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            execute_system_command,
            cancel_schedule
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
