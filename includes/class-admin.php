<?php
namespace PlintusProfileEditor;

class Admin {
    public function init() {
        add_action('admin_menu', [$this, 'add_menu_page']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_filter('post_row_actions', [$this, 'add_row_actions'], 10, 2);
        add_action('edit_form_after_title', [$this, 'add_editor_interface']);
        add_filter('get_sample_permalink_html', [$this, 'remove_permalink_editor'], 10, 5);
    }

    public function add_menu_page() {
        // Menu уже есть через CPT, но можно добавить отдельную страницу если нужно
    }

    public function enqueue_scripts($hook) {
        global $post;

        // Загружаем только на странице редактирования профиля
        if ($hook !== 'post.php' && $hook !== 'post-new.php') {
            return;
        }

        if (!$post || $post->post_type !== CPT::POST_TYPE) {
            return;
        }

        // Загружаем React из CDN (или можно использовать wp_enqueue_script для локальных файлов)
        wp_enqueue_script(
            'react',
            'https://unpkg.com/react@18/umd/react.production.min.js',
            [],
            '18.2.0',
            true
        );

        wp_enqueue_script(
            'react-dom',
            'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
            ['react'],
            '18.2.0',
            true
        );

        // Konva теперь включен в bundle, не нужно загружать отдельно
        // Загружаем React редактор
        wp_enqueue_script(
            'plintus-profile-editor',
            Plugin::get_url() . 'admin/js/editor.bundle.js',
            ['react', 'react-dom'],
            Plugin::get_version(),
            true
        );

        wp_enqueue_style(
            'unicons',
            'https://unicons.iconscout.com/release/v4.0.8/css/line.css',
            [],
            '4.0.8'
        );

        wp_enqueue_style(
            'plintus-profile-editor-admin',
            Plugin::get_url() . 'admin/css/admin.css',
            [],
            Plugin::get_version()
        );

        // Передаем данные в JavaScript
        wp_localize_script('plintus-profile-editor', 'plintusEditor', array(
            'apiUrl' => rest_url('plintus/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'profileId' => $post->ID,
            'postId' => $post->ID,
            'strings' => array(
                'lineTool' => __('Line Tool', 'plintus-profile-editor'),
                'arcTool' => __('Arc Tool', 'plintus-profile-editor'),
                'selectTool' => __('Select Tool', 'plintus-profile-editor'),
                'deleteTool' => __('Delete', 'plintus-profile-editor'),
            ),
        ));
    }

    public function add_row_actions($actions, $post) {
        if ($post->post_type === CPT::POST_TYPE) {
            $actions['edit_profile'] = sprintf(
                '<a href="%s">%s</a>',
                get_edit_post_link($post->ID),
                __('Edit Profile', 'plintus-profile-editor')
            );
        }
        return $actions;
    }

    public function add_editor_interface($post) {
        if ($post->post_type !== CPT::POST_TYPE) {
            return;
        }
        ?>
        <div id="plintus-profile-editor-root"></div>
        <?php
    }

    public function remove_permalink_editor($return, $post_id, $new_title, $new_slug, $post) {
        if ($post->post_type === CPT::POST_TYPE) {
            return '';
        }
        return $return;
    }
}

