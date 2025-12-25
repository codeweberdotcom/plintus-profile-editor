<?php
namespace PlintusProfileEditor;

class CPT {
    const POST_TYPE = 'plintus_profile';

    public function register() {
        $labels = [
            'name'                  => __('Profiles', 'plintus-profile-editor'),
            'singular_name'         => __('Profile', 'plintus-profile-editor'),
            'menu_name'             => __('Plintus Profiles', 'plintus-profile-editor'),
            'add_new'               => __('Add New', 'plintus-profile-editor'),
            'add_new_item'          => __('Add New Profile', 'plintus-profile-editor'),
            'edit_item'             => __('Edit Profile', 'plintus-profile-editor'),
            'new_item'              => __('New Profile', 'plintus-profile-editor'),
            'view_item'             => __('View Profile', 'plintus-profile-editor'),
            'search_items'          => __('Search Profiles', 'plintus-profile-editor'),
            'not_found'             => __('No profiles found', 'plintus-profile-editor'),
            'not_found_in_trash'    => __('No profiles found in trash', 'plintus-profile-editor'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_icon'           => 'dashicons-admin-customizer',
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'supports'            => ['title', 'author'],
            'has_archive'         => false,
            'rewrite'             => false,
            'query_var'           => false,
            'show_in_rest'        => true,
            'rest_base'           => 'plintus-profiles',
            'rest_controller_class' => 'WP_REST_Posts_Controller',
        ];

        register_post_type(self::POST_TYPE, $args);
    }
}

