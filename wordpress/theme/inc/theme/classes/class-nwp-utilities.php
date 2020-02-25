<?php

/**
 * Utilities class
 *
 */

// If file is accessed directly, exit
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class NWP_Utilities {
	public function __construct() {
	}

	// Get URL without any vars
	public function get_current_clean_url() {
		global $wp;
		$wp->remove_query_var( 'paged', 'any' );

		$current_url = home_url( remove_query_arg( array( 'paged' => false ), $wp->request ) );

		return $current_url;
	}

	// Convert array to list
	public function convert_array_to_list( $var ) {
		$array = count( $var ) ? $var : array();
		return count( $array ) ? implode( ', ', $array ) : 'Nothing';
	}

	// Check if debug mode is on
	public function is_debug() {
		return ( WP_DEBUG === 'true' ? true : false );
	}

	// Enqueue theme assets
	public function enqueue_theme_assets() {
		wp_enqueue_style( 'main-css', get_template_directory_uri() . '/css/main.css', array(), CACHE_BUSTING );
		wp_enqueue_script( 'main-js', get_template_directory_uri() . '/js/main.js', array(), CACHE_BUSTING, true );
		if ( $this->is_debug() ) {
			wp_enqueue_script( 'browser-sync-client', ':3000/browser-sync/browser-sync-client.js', array(), CACHE_BUSTING, true );
		}
	}

	public function my_custom_upload_mimes( $mimes = array() ) {
		// Add a key and value for the SVG file type
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
	}
}