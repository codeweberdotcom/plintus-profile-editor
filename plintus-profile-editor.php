<?php
/**
 * Plugin Name: Plintus Profile Editor
 * Plugin URI: https://example.com/plintus-profile-editor
 * Description: Редактор профилей плинтусов по сетке с возможностью рисования линий, скруглений и редактирования
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: plintus-profile-editor
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('PLINTUS_PROFILE_EDITOR_VERSION', '1.0.0');
define('PLINTUS_PROFILE_EDITOR_PATH', plugin_dir_path(__FILE__));
define('PLINTUS_PROFILE_EDITOR_URL', plugin_dir_url(__FILE__));
define('PLINTUS_PROFILE_EDITOR_BASENAME', plugin_basename(__FILE__));

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'PlintusProfileEditor\\';
    $base_dir = PLINTUS_PROFILE_EDITOR_PATH . 'includes/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    // Конвертируем имя класса в имя файла
    // PlintusProfileEditor\CPT -> class-cpt.php
    // PlintusProfileEditor\Admin -> class-admin.php
    $file_name = 'class-' . strtolower($relative_class) . '.php';
    $file = $base_dir . $file_name;
    
    if (file_exists($file)) {
        require $file;
    }
});

// Initialize plugin
function plintus_profile_editor_init() {
    $plugin = new \PlintusProfileEditor\Plugin();
    $plugin->init();
}
add_action('plugins_loaded', 'plintus_profile_editor_init');

// Activation hook
register_activation_hook(__FILE__, function() {
    // Flush rewrite rules
    flush_rewrite_rules();
});

// Deactivation hook
register_deactivation_hook(__FILE__, function() {
    flush_rewrite_rules();
});

