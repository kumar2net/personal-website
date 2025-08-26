<?php
/**
 * Plugin Name: WordPress to Netlify Publisher
 * Description: Adds a "Publish to Netlify" button to WordPress posts
 * Version: 1.0.0
 * Author: Kumar
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class WordPressToNetlifyPublisher {
    
    public function __construct() {
        add_action('add_meta_boxes', array($this, 'add_netlify_meta_box'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_publish_to_netlify', array($this, 'handle_publish_request'));
    }
    
    public function add_netlify_meta_box() {
        add_meta_box(
            'netlify_publisher',
            '🌐 Publish to Netlify',
            array($this, 'render_meta_box'),
            'post',
            'side',
            'high'
        );
    }
    
    public function render_meta_box($post) {
        if ($post->post_status !== 'publish') {
            echo '<p style="color: #666;">Publish this post first to enable Netlify publishing.</p>';
            return;
        }
        
        echo '<div id="netlify-publisher-meta">';
        echo '<p style="margin-bottom: 10px;">Click the button below to publish this post to your Netlify site.</p>';
        echo '<button id="publish-to-netlify-btn" class="button button-primary" onclick="publishToNetlify(' . $post->ID . ')">';
        echo '📤 Publish to Netlify';
        echo '</button>';
        echo '<div id="publish-status" style="margin-top: 10px; display: none;"></div>';
        echo '</div>';
    }
    
    public function enqueue_scripts() {
        if (is_single() && get_post_type() === 'post') {
            wp_enqueue_script('netlify-publisher', plugin_dir_url(__FILE__) . 'netlify-publisher.js', array(), '1.0.0', true);
            wp_localize_script('netlify-publisher', 'netlifyPublisher', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('netlify_publisher_nonce')
            ));
        }
    }
    
    public function handle_publish_request() {
        check_ajax_referer('netlify_publisher_nonce', 'nonce');
        
        $post_id = intval($_POST['post_id']);
        
        if (!$post_id || get_post_status($post_id) !== 'publish') {
            wp_die('Invalid post or post not published');
        }
        
        // Call Netlify function
        $response = wp_remote_post('https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish', array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array(
                'postId' => $post_id,
                'action' => 'publish'
            )),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error('Network error: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $result = json_decode($body, true);
        
        if ($result && isset($result['success']) && $result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result['error'] ?? 'Unknown error');
        }
    }
}

// Initialize the plugin
new WordPressToNetlifyPublisher();
