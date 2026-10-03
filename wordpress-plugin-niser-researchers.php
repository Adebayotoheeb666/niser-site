<?php
/**
 * Plugin Name: NISER Researchers Contact Fields
 * Plugin URI: http://niser.local
 * Description: Exposes email, role, phone, and social media fields in the REST API for researcher posts and adds admin UI
 * Version: 1.0.0
 * Author: NISER
 * License: GPL v2 or later
 * Text Domain: niser-researchers
 */

if (!defined('ABSPATH')) {
    exit;
}

function niser_researcher_get_meta($post_id, $key, $default = '') {
    $value = get_post_meta($post_id, '_niser_' . $key, true);
    if ($value === '' || $value === null) {
        $value = get_post_meta($post_id, '_researcher_' . $key, true);
    }
    return $value !== '' ? $value : $default;
}

function niser_researcher_update_meta($post_id, $key, $value) {
    update_post_meta($post_id, '_niser_' . $key, $value);
    update_post_meta($post_id, '_researcher_' . $key, $value);
    return $value;
}

function niser_publication_get_meta($post_id, $key, $default = '') {
    $value = get_post_meta($post_id, '_niser_' . $key, true);
    return $value !== '' ? $value : $default;
}

function niser_publication_update_meta($post_id, $key, $value) {
    update_post_meta($post_id, '_niser_' . $key, $value);
    return $value;
}

// ─── REST API Field Registration ────────────────────────────────────────────

add_action('rest_api_init', function() {
    if (!post_type_exists('niser_researcher')) {
        return;
    }

    // Register email field for REST API
    register_rest_field('niser_researcher', 'email', array(
        'get_callback' => function($post) {
            return niser_researcher_get_meta($post['id'], 'email');
        },
        'update_callback' => function($value, $post) {
            if (is_email($value) || empty($value)) {
                return niser_researcher_update_meta($post->ID, 'email', sanitize_email($value));
            }
            return new WP_Error('invalid_email', 'Invalid email address');
        },
        'schema' => array(
            'type' => 'string',
            'format' => 'email',
            'description' => 'Researcher email address',
            'context' => array('view', 'edit')
        )
    ));

    // Register role field for REST API
    register_rest_field('niser_researcher', 'role', array(
        'get_callback' => function($post) {
            return niser_researcher_get_meta($post['id'], 'position');
        },
        'update_callback' => function($value, $post) {
            return niser_researcher_update_meta($post->ID, 'position', sanitize_text_field($value));
        },
        'schema' => array(
            'type' => 'string',
            'description' => 'Researcher role or position',
            'context' => array('view', 'edit')
        )
    ));

    // Register phone field for REST API
    register_rest_field('niser_researcher', 'phone', array(
        'get_callback' => function($post) {
            return niser_researcher_get_meta($post['id'], 'phone');
        },
        'update_callback' => function($value, $post) {
            return niser_researcher_update_meta($post->ID, 'phone', sanitize_text_field($value));
        },
        'schema' => array(
            'type' => 'string',
            'description' => 'Researcher phone number',
            'context' => array('view', 'edit')
        )
    ));

    // Register website URL field for REST API
    register_rest_field('niser_researcher', 'websiteUrl', array(
        'get_callback' => function($post) {
            return niser_researcher_get_meta($post['id'], 'website_url');
        },
        'update_callback' => function($value, $post) {
            return niser_researcher_update_meta($post->ID, 'website_url', esc_url_raw($value));
        },
        'schema' => array(
            'type' => 'string',
            'format' => 'uri',
            'description' => 'Researcher website URL',
            'context' => array('view', 'edit')
        )
    ));

    // Register LinkedIn field for REST API
    register_rest_field('niser_researcher', 'linkedin', array(
        'get_callback' => function($post) {
            return niser_researcher_get_meta($post['id'], 'linkedin');
        },
        'update_callback' => function($value, $post) {
            return niser_researcher_update_meta($post->ID, 'linkedin', sanitize_text_field($value));
        },
        'schema' => array(
            'type' => 'string',
            'description' => 'Researcher LinkedIn profile URL',
            'context' => array('view', 'edit')
        )
    ));

    // Register Google Scholar field for REST API
    register_rest_field('niser_researcher', 'googleScholar', array(
        'get_callback' => function($post) {
            return niser_researcher_get_meta($post['id'], 'google_scholar');
        },
        'update_callback' => function($value, $post) {
            return niser_researcher_update_meta($post->ID, 'google_scholar', sanitize_text_field($value));
        },
        'schema' => array(
            'type' => 'string',
            'description' => 'Researcher Google Scholar profile',
            'context' => array('view', 'edit')
        )
    ));

    // Register ResearchGate field for REST API
    register_rest_field('niser_researcher', 'researchGate', array(
        'get_callback' => function($post) {
            return niser_researcher_get_meta($post['id'], 'research_gate');
        },
        'update_callback' => function($value, $post) {
            return niser_researcher_update_meta($post->ID, 'research_gate', sanitize_text_field($value));
        },
        'schema' => array(
            'type' => 'string',
            'description' => 'Researcher ResearchGate profile',
            'context' => array('view', 'edit')
        )
    ));
});

// ─── Admin Meta Box ──────────────────────────────────────────────────────────

add_action('add_meta_boxes', function() {
    if (!post_type_exists('niser_researcher')) {
        return;
    }

    add_meta_box(
        'niser_researcher_contact',
        'Contact Information',
        'niser_researcher_contact_meta_box_callback',
        'niser_researcher',
        'normal',
        'high'
    );
});

function niser_researcher_contact_meta_box_callback($post) {
    $email = niser_researcher_get_meta($post->ID, 'email');
    $phone = niser_researcher_get_meta($post->ID, 'phone');
    $role = niser_researcher_get_meta($post->ID, 'position');
    $websiteUrl = niser_researcher_get_meta($post->ID, 'website_url');
    $linkedin = niser_researcher_get_meta($post->ID, 'linkedin');
    $googleScholar = niser_researcher_get_meta($post->ID, 'google_scholar');
    $researchGate = niser_researcher_get_meta($post->ID, 'research_gate');

    wp_nonce_field('niser_researcher_contact_nonce', 'niser_researcher_contact_nonce');
    ?>
    <div style="margin-bottom: 15px;">
        <label for="niser_researcher_email" style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            Email Address
        </label>
        <input 
            type="email" 
            id="niser_researcher_email" 
            name="niser_researcher_email" 
            value="<?php echo esc_attr($email); ?>" 
            style="width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" 
            placeholder="researcher@niser.gov.ng"
        />
        <p style="margin-top: 4px; color: #666; font-size: 13px;">
            The researcher's contact email address (displayed in staff directory)
        </p>
    </div>

    <div style="margin-bottom: 15px;">
        <label for="niser_researcher_phone" style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            Phone Number
        </label>
        <input 
            type="tel" 
            id="niser_researcher_phone" 
            name="niser_researcher_phone" 
            value="<?php echo esc_attr($phone); ?>" 
            style="width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" 
            placeholder="+234 (0) 803 000 0000"
        />
        <p style="margin-top: 4px; color: #666; font-size: 13px;">
            The researcher's contact phone number (displayed in staff directory)
        </p>
    </div>

    <div style="margin-bottom: 15px;">
        <label for="niser_researcher_role" style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            Role / Position
        </label>
        <input 
            type="text" 
            id="niser_researcher_role" 
            name="niser_researcher_role" 
            value="<?php echo esc_attr($role); ?>" 
            style="width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" 
            placeholder="Chief Research Fellow"
        />
        <p style="margin-top: 4px; color: #666; font-size: 13px;">
            The researcher's role or job title.
        </p>
    </div>

    <div style="margin-bottom: 15px;">
        <label for="niser_researcher_website_url" style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            Website URL
        </label>
        <input 
            type="url" 
            id="niser_researcher_website_url" 
            name="niser_researcher_website_url" 
            value="<?php echo esc_attr($websiteUrl); ?>" 
            style="width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" 
            placeholder="https://example.com"
        />
    </div>

    <div style="margin-bottom: 15px;">
        <label for="niser_researcher_linkedin" style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            LinkedIn URL
        </label>
        <input 
            type="url" 
            id="niser_researcher_linkedin" 
            name="niser_researcher_linkedin" 
            value="<?php echo esc_attr($linkedin); ?>" 
            style="width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" 
            placeholder="https://linkedin.com/in/username"
        />
    </div>

    <div style="margin-bottom: 15px;">
        <label for="niser_researcher_google_scholar" style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            Google Scholar URL
        </label>
        <input 
            type="url" 
            id="niser_researcher_google_scholar" 
            name="niser_researcher_google_scholar" 
            value="<?php echo esc_attr($googleScholar); ?>" 
            style="width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" 
            placeholder="https://scholar.google.com/citations?user=..."
        />
    </div>

    <div>
        <label for="niser_researcher_research_gate" style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            ResearchGate URL
        </label>
        <input 
            type="url" 
            id="niser_researcher_research_gate" 
            name="niser_researcher_research_gate" 
            value="<?php echo esc_attr($researchGate); ?>" 
            style="width: 100%; max-width: 400px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" 
            placeholder="https://www.researchgate.net/profile/..."
        />
    </div>
    <?php
}

// ─── Save Meta Box Data ──────────────────────────────────────────────────────

function niser_researcher_save_fields_from_request($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['niser_researcher_contact_nonce'])) {
        if (!wp_verify_nonce($_POST['niser_researcher_contact_nonce'], 'niser_researcher_contact_nonce')) {
            return;
        }
    }

    if (isset($_POST['niser_researcher_email'])) {
        $email = sanitize_email($_POST['niser_researcher_email']);
        if (empty($email) || is_email($email)) {
            niser_researcher_update_meta($post_id, 'email', $email);
        }
    }

    if (isset($_POST['niser_researcher_phone'])) {
        $phone = sanitize_text_field($_POST['niser_researcher_phone']);
        niser_researcher_update_meta($post_id, 'phone', $phone);
    }

    if (isset($_POST['niser_researcher_role'])) {
        $role = sanitize_text_field($_POST['niser_researcher_role']);
        niser_researcher_update_meta($post_id, 'position', $role);
    }

    if (isset($_POST['niser_researcher_website_url'])) {
        $websiteUrl = esc_url_raw($_POST['niser_researcher_website_url']);
        niser_researcher_update_meta($post_id, 'website_url', $websiteUrl);
    }

    if (isset($_POST['niser_researcher_linkedin'])) {
        $linkedin = sanitize_text_field($_POST['niser_researcher_linkedin']);
        niser_researcher_update_meta($post_id, 'linkedin', $linkedin);
    }

    if (isset($_POST['niser_researcher_google_scholar'])) {
        $googleScholar = sanitize_text_field($_POST['niser_researcher_google_scholar']);
        niser_researcher_update_meta($post_id, 'google_scholar', $googleScholar);
    }

    if (isset($_POST['niser_researcher_research_gate'])) {
        $researchGate = sanitize_text_field($_POST['niser_researcher_research_gate']);
        niser_researcher_update_meta($post_id, 'research_gate', $researchGate);
    }
}

add_action('save_post_niser_researcher', 'niser_researcher_save_fields_from_request');

function niser_publication_save_fields_from_request($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['niser_publication_type'])) {
        niser_publication_update_meta($post_id, 'publication_type', sanitize_text_field($_POST['niser_publication_type']));
    }

    if (isset($_POST['niser_published_year'])) {
        niser_publication_update_meta($post_id, 'published_year', absint($_POST['niser_published_year']));
    }

    if (isset($_POST['niser_doi'])) {
        niser_publication_update_meta($post_id, 'doi', sanitize_text_field($_POST['niser_doi']));
    }

    if (isset($_POST['niser_citation_count'])) {
        niser_publication_update_meta($post_id, 'citation_count', absint($_POST['niser_citation_count']));
    }

    if (isset($_POST['niser_is_open_access'])) {
        niser_publication_update_meta($post_id, 'is_open_access', 1);
    } else {
        delete_post_meta($post_id, '_niser_is_open_access');
    }
}

add_action('save_post_niser_publication', 'niser_publication_save_fields_from_request');

add_action('wp_ajax_inline-save', function() {
    if (empty($_POST['post_ID']) || empty($_POST['post_type'])) {
        return;
    }

    if (!current_user_can('edit_post', intval($_POST['post_ID']))) {
        return;
    }

    if ($_POST['post_type'] === 'niser_researcher') {
        niser_researcher_save_fields_from_request(intval($_POST['post_ID']));
    }

    if ($_POST['post_type'] === 'niser_publication') {
        niser_publication_save_fields_from_request(intval($_POST['post_ID']));
    }
    if ($_POST['post_type'] === 'niser_event') {
        niser_event_save_fields_from_request(intval($_POST['post_ID']));
    }
});

add_action('wp_ajax_inline_save', function() {
    if (empty($_POST['post_ID']) || empty($_POST['post_type'])) {
        return;
    }

    if (!current_user_can('edit_post', intval($_POST['post_ID']))) {
        return;
    }

    if ($_POST['post_type'] === 'niser_researcher') {
        niser_researcher_save_fields_from_request(intval($_POST['post_ID']));
    }

    if ($_POST['post_type'] === 'niser_publication') {
        niser_publication_save_fields_from_request(intval($_POST['post_ID']));
    }
    if ($_POST['post_type'] === 'niser_event') {
        niser_event_save_fields_from_request(intval($_POST['post_ID']));
    }
});

// ─── List Table Columns (show editable researcher fields) ───────────────────

function niser_researcher_admin_columns($columns) {
    $new = array();
    foreach ($columns as $key => $title) {
        $new[$key] = $title;
        if ($key === 'title') {
            $new['email'] = 'Email';
            $new['phone'] = 'Phone';
            $new['role'] = 'Role';
            $new['website'] = 'Website';
            $new['linkedin'] = 'LinkedIn';
            $new['google_scholar'] = 'Google Scholar';
            $new['research_gate'] = 'ResearchGate';
        }
    }
    return $new;
}

add_filter('manage_edit-niser_researcher_columns', 'niser_researcher_admin_columns');
add_filter('manage_niser_researcher_posts_columns', 'niser_researcher_admin_columns');

add_action('manage_niser_researcher_posts_custom_column', function($column, $post_id) {
    if ($column === 'email') {
        echo esc_html(niser_researcher_get_meta($post_id, 'email'));
    } elseif ($column === 'phone') {
        echo esc_html(niser_researcher_get_meta($post_id, 'phone'));
    } elseif ($column === 'role') {
        echo esc_html(niser_researcher_get_meta($post_id, 'position'));
    } elseif ($column === 'website') {
        echo esc_html(niser_researcher_get_meta($post_id, 'website_url'));
    } elseif ($column === 'linkedin') {
        echo esc_html(niser_researcher_get_meta($post_id, 'linkedin'));
    } elseif ($column === 'google_scholar') {
        echo esc_html(niser_researcher_get_meta($post_id, 'google_scholar'));
    } elseif ($column === 'research_gate') {
        echo esc_html(niser_researcher_get_meta($post_id, 'research_gate'));
    }
}, 10, 2);

function niser_publication_admin_columns($columns) {
    $new = array();
    foreach ($columns as $key => $title) {
        $new[$key] = $title;
        if ($key === 'title') {
            $new['publication_type'] = 'Type';
            $new['published_year'] = 'Year';
            $new['doi'] = 'DOI';
            $new['is_open_access'] = 'Open Access';
            $new['citation_count'] = 'Citations';
        }
    }
    return $new;
}

add_filter('manage_edit-niser_publication_columns', 'niser_publication_admin_columns');
add_filter('manage_niser_publication_posts_columns', 'niser_publication_admin_columns');

add_action('manage_niser_publication_posts_custom_column', function($column, $post_id) {
    if ($column === 'publication_type') {
        echo esc_html(niser_publication_get_meta($post_id, 'publication_type'));
    } elseif ($column === 'published_year') {
        echo esc_html(niser_publication_get_meta($post_id, 'published_year'));
    } elseif ($column === 'doi') {
        echo esc_html(niser_publication_get_meta($post_id, 'doi'));
    } elseif ($column === 'is_open_access') {
        $value = niser_publication_get_meta($post_id, 'is_open_access');
        echo $value ? 'Yes' : 'No';
    } elseif ($column === 'citation_count') {
        echo esc_html(niser_publication_get_meta($post_id, 'citation_count'));
    }
}, 10, 2);

// ─── Quick Edit Support ──────────────────────────────────────────────────────

add_action('admin_footer-edit.php', function() {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || !in_array($screen->post_type, array('niser_researcher', 'niser_publication'), true)) {
        return;
    }
    ?>
    <script>
    (function($) {
        function addQuickEditFields(postType) {
            var $row = $('.inline-edit-row');
            if (!$row.length || $row.find('.niser-quick-edit-fields').length) {
                return;
            }

            var $container = $row.find('.inline-edit-col-left');
            if (!$container.length) {
                return;
            }

            var html = '';
            if (postType === 'niser_researcher') {
                html = '<fieldset class="inline-edit-col-left niser-quick-edit-fields">' +
                    '<legend class="inline-edit-legend">Researcher Contact</legend>' +
                    '<div class="inline-edit-col"><label><span class="title">Email</span><span class="input-text-wrap"><input type="email" name="niser_researcher_email" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">Phone</span><span class="input-text-wrap"><input type="text" name="niser_researcher_phone" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">Role</span><span class="input-text-wrap"><input type="text" name="niser_researcher_role" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">Website</span><span class="input-text-wrap"><input type="url" name="niser_researcher_website_url" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">LinkedIn</span><span class="input-text-wrap"><input type="url" name="niser_researcher_linkedin" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">Google Scholar</span><span class="input-text-wrap"><input type="url" name="niser_researcher_google_scholar" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">ResearchGate</span><span class="input-text-wrap"><input type="url" name="niser_researcher_research_gate" value="" /></span></label></div>' +
                    '</fieldset>';
            } else if (postType === 'niser_publication') {
                html = '<fieldset class="inline-edit-col-left niser-quick-edit-fields">' +
                    '<legend class="inline-edit-legend">Publication Details</legend>' +
                    '<div class="inline-edit-col"><label><span class="title">Type</span><span class="input-text-wrap"><input type="text" name="niser_publication_type" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">Year</span><span class="input-text-wrap"><input type="number" name="niser_published_year" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">DOI</span><span class="input-text-wrap"><input type="text" name="niser_doi" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">Citations</span><span class="input-text-wrap"><input type="number" name="niser_citation_count" value="" /></span></label></div>' +
                    '<div class="inline-edit-col"><label><span class="title">Open Access</span><span class="input-text-wrap"><input type="checkbox" name="niser_is_open_access" value="1" /></span></label></div>' +
                    '</fieldset>';
            }

            if (html) {
                $container.first().before(html);
            }
        }

        $(document).on('click', '.editinline', function() {
            setTimeout(function() {
                var post_id = $(this).closest('tr').attr('id').replace('post-', '');
                var row = $('#post-' + post_id);
                var $inline = $('.inline-edit-row');
                var postType = $('body').hasClass('post-type-niser_publication') ? 'niser_publication' : 'niser_researcher';

                addQuickEditFields(postType);

                if (postType === 'niser_researcher') {
                    $inline.find('input[name="niser_researcher_email"]').val(row.find('.column-email').text().trim());
                    $inline.find('input[name="niser_researcher_phone"]').val(row.find('.column-phone').text().trim());
                    $inline.find('input[name="niser_researcher_role"]').val(row.find('.column-role').text().trim());
                    $inline.find('input[name="niser_researcher_website_url"]').val(row.find('.column-website').text().trim());
                    $inline.find('input[name="niser_researcher_linkedin"]').val(row.find('.column-linkedin').text().trim());
                    $inline.find('input[name="niser_researcher_google_scholar"]').val(row.find('.column-google_scholar').text().trim());
                    $inline.find('input[name="niser_researcher_research_gate"]').val(row.find('.column-research_gate').text().trim());
                } else {
                    $inline.find('input[name="niser_publication_type"]').val(row.find('.column-publication_type').text().trim());
                    $inline.find('input[name="niser_published_year"]').val(row.find('.column-published_year').text().trim());
                    $inline.find('input[name="niser_doi"]').val(row.find('.column-doi').text().trim());
                    $inline.find('input[name="niser_citation_count"]').val(row.find('.column-citation_count').text().trim());
                    var openAccess = row.find('.column-is_open_access').text().trim().toLowerCase();
                    $inline.find('input[name="niser_is_open_access"]').prop('checked', openAccess === 'yes');
                }
            }.bind(this), 50);
        });
    })(jQuery);
    </script>
    <?php
});

add_filter('sanitize_post_meta__researcher_email', function($value) {
    return sanitize_email($value);
});

add_filter('sanitize_post_meta__researcher_phone', function($value) {
    return sanitize_text_field($value);
});

// ─── Custom REST namespace for frontend compatibility ─────────────────────────

function niser_map_researcher_post(WP_Post $post) {
    $meta = get_post_meta($post->ID);
    return array(
        'id' => (string) $post->ID,
        'fullName' => $post->post_title,
        'slug' => $post->post_name,
        'titlePrefix' => isset($meta['title_prefix']) ? $meta['title_prefix'][0] : '',
        'position' => isset($meta['position']) ? $meta['position'][0] : '',
        'division' => isset($meta['division']) ? $meta['division'][0] : '',
        'photo' => isset($meta['_researcher_photo']) ? $meta['_researcher_photo'][0] : '',
        'biography' => $post->post_content,
        'researchInterests' => isset($meta['_researcher_interests']) ? array_map('trim', explode(',', $meta['_researcher_interests'][0])) : array(),
        'orcid' => isset($meta['_researcher_orcid']) ? $meta['_researcher_orcid'][0] : '',
        'googleScholar' => isset($meta['_researcher_google_scholar']) ? $meta['_researcher_google_scholar'][0] : '',
        'researchGate' => isset($meta['_researcher_researchgate']) ? $meta['_researcher_researchgate'][0] : '',
        'email' => isset($meta['_niser_email']) ? $meta['_niser_email'][0] : niser_researcher_get_meta($post->ID, 'email'),
        'phone' => isset($meta['_niser_phone']) ? $meta['_niser_phone'][0] : niser_researcher_get_meta($post->ID, 'phone'),
        'linkedin' => isset($meta['_niser_linkedin']) ? $meta['_niser_linkedin'][0] : niser_researcher_get_meta($post->ID, 'linkedin'),
        'websiteUrl' => isset($meta['_niser_website_url']) ? $meta['_niser_website_url'][0] : niser_researcher_get_meta($post->ID, 'website_url'),
        'isActive' => $post->post_status === 'publish',
        'status' => $post->post_status === 'publish' ? 'published' : 'draft',
    );
}

add_action('rest_api_init', function() {
    register_rest_route('niser/v1', '/researchers', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $params = $request->get_query_params();
            $paged = isset($params['page']) ? max(1, intval($params['page'])) : 1;
            $limit = isset($params['limit']) ? max(1, intval($params['limit'])) : 50;

            $args = array(
                'post_type' => 'niser_researcher',
                'posts_per_page' => $limit,
                'paged' => $paged,
                'post_status' => array('publish', 'draft'),
            );

            if (!empty($params['division'])) {
                $args['meta_query'] = array(
                    array('key' => 'division', 'value' => sanitize_text_field($params['division']))
                );
            }

            $query = new WP_Query($args);
            $results = array_map('niser_map_researcher_post', $query->posts);

            return rest_ensure_response($results);
        },
        'permission_callback' => '__return_true',
    ));

    register_rest_route('niser/v1', '/researchers/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $slug = $request->get_param('slug');
            $posts = get_posts(array(
                'name' => $slug,
                'post_type' => 'niser_researcher',
                'post_status' => array('publish', 'draft'),
                'numberposts' => 1,
            ));
            if (empty($posts)) {
                return new WP_Error('not_found', 'Researcher not found', array('status' => 404));
            }
            return rest_ensure_response(niser_map_researcher_post($posts[0]));
        },
        'permission_callback' => '__return_true',
    ));
});

// ─── Insights / Briefs: CPT, meta, admin UI, REST listing ────────────────

function niser_insight_get_meta($post_id, $key, $default = '') {
    $value = get_post_meta($post_id, '_niser_' . $key, true);
    return $value !== '' && $value !== null ? $value : $default;
}

function niser_insight_update_meta($post_id, $key, $value) {
    update_post_meta($post_id, '_niser_' . $key, $value);
    return $value;
}

function niser_register_insight_cpt() {
    $labels = array(
        'name' => 'Insights',
        'singular_name' => 'Insight',
        'add_new_item' => 'Add New Brief',
        'edit_item' => 'Edit Brief',
        'new_item' => 'New Brief',
    );
    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'author'),
        'rewrite' => array('slug' => 'insights'),
        'has_archive' => true,
        'show_admin_column' => true,
        'taxonomies' => array('category', 'post_tag'),
    );
    register_post_type('niser_insight', $args);
}
add_action('init', 'niser_register_insight_cpt');

function niser_register_insight_meta() {
    $fields = array(
        'content_type' => 'string',
        'social_summary' => 'string',
        'body_plaintext' => 'string',
        'featured_image_url' => 'string',
        'pdf_file_url' => 'string',
        'documents' => 'string',
        'is_breaking' => 'boolean',
        'ai_generated' => 'boolean',
        'author_slug' => 'string',
        'author_full_name' => 'string',
        'author_title_prefix' => 'string',
    );

    foreach ($fields as $field => $type) {
        register_post_meta('niser_insight', $field, array(
            'show_in_rest' => true,
            'single' => true,
            'type' => $type,
            'default' => $type === 'boolean' ? false : '',
        ));
    }
}
add_action('init', 'niser_register_insight_meta');

add_action('add_meta_boxes', function() {
    if (!post_type_exists('niser_insight')) {
        return;
    }

    add_meta_box(
        'niser_insight_details',
        'Brief Details',
        'niser_insight_meta_box_callback',
        'niser_insight',
        'normal',
        'high'
    );
});

function niser_insight_meta_box_callback($post) {
    $content_type = niser_insight_get_meta($post->ID, 'content_type', 'policy_brief');
    $social_summary = niser_insight_get_meta($post->ID, 'social_summary', '');
    $featured_image_url = niser_insight_get_meta($post->ID, 'featured_image_url', '');
    $pdf_file_url = niser_insight_get_meta($post->ID, 'pdf_file_url', '');
    $documents_json = niser_insight_get_meta($post->ID, 'documents', '[]');
    $documents = json_decode($documents_json, true) ?: [];
    $is_breaking = (bool) niser_insight_get_meta($post->ID, 'is_breaking', false);
    $ai_generated = (bool) niser_insight_get_meta($post->ID, 'ai_generated', false);

    wp_nonce_field('niser_insight_nonce', 'niser_insight_nonce');
    ?>
    <p>
        <label for="niser_insight_content_type"><strong>Content Type</strong></label><br />
        <select id="niser_insight_content_type" name="niser_insight_content_type" style="width:100%;max-width:320px;">
            <option value="policy_brief" <?php selected($content_type, 'policy_brief'); ?>>Policy Brief</option>
            <option value="commentary" <?php selected($content_type, 'commentary'); ?>>Commentary</option>
            <option value="analysis" <?php selected($content_type, 'analysis'); ?>>Analysis</option>
            <option value="opinion" <?php selected($content_type, 'opinion'); ?>>Opinion</option>
            <option value="rapid_response" <?php selected($content_type, 'rapid_response'); ?>>Rapid Response</option>
        </select>
    </p>
    <p>
        <label for="niser_insight_social_summary"><strong>Social Summary</strong></label><br />
        <textarea id="niser_insight_social_summary" name="niser_insight_social_summary" rows="3" style="width:100%;max-width:640px;"><?php echo esc_textarea($social_summary); ?></textarea>
    </p>
    <p>
        <label for="niser_insight_featured_image"><strong>Featured Image URL</strong></label><br />
        <input type="url" id="niser_insight_featured_image" name="niser_insight_featured_image" value="<?php echo esc_attr($featured_image_url); ?>" style="width:100%;max-width:640px;" />
    </p>
    <p>
        <label for="niser_insight_pdf_file"><strong>PDF Download URL</strong></label><br />
        <input type="url" id="niser_insight_pdf_file" name="niser_insight_pdf_file" value="<?php echo esc_attr($pdf_file_url); ?>" style="width:100%;max-width:640px;" />
    </p>
    
    <!-- Additional Documents Section -->
    <div style="margin-top:20px;padding:15px;border:2px solid #0073aa;border-radius:5px;background:#f0f6fc;">
        <p style="margin-top:0;margin-bottom:15px;">
            <label style="display:block;font-weight:bold;font-size:1.1em;color:#0073aa;margin-bottom:10px;">
                <span style="background-color:#0073aa;color:white;padding:2px 6px;border-radius:3px;margin-right:5px;font-size:0.9em;">📎</span>
                Additional Documents
            </label>
            <span style="display:block;color:#666;font-size:0.9em;margin-bottom:10px;font-style:italic;">
                Attach supporting documents, research papers, or additional materials to this brief
            </span>
            <div id="niser_documents_container" style="margin-top:10px;margin-bottom:10px;">
                <?php if (!empty($documents)) : ?>
                    <?php foreach ($documents as $idx => $doc) : ?>
                        <div class="niser-document-item" style="border:1px solid #ddd;padding:10px;margin-bottom:10px;border-radius:4px;background:white;">
                            <div style="margin-bottom:8px;">
                                <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">Document Title</label>
                                <input type="text" placeholder="Enter document name" class="niser-doc-title" value="<?php echo esc_attr($doc['title'] ?? ''); ?>" style="width:100%;max-width:400px;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                            </div>
                            <div style="margin-bottom:8px;">
                                <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">Document URL</label>
                                <input type="url" placeholder="https://example.com/document.pdf" class="niser-doc-url" value="<?php echo esc_attr($doc['url'] ?? ''); ?>" style="width:100%;max-width:500px;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                            </div>
                            <div style="display:flex;gap:15px;margin-bottom:8px;">
                                <div style="flex:1;min-width:150px;">
                                    <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">File Type</label>
                                    <input type="text" placeholder="PDF, Word, Excel, etc." class="niser-doc-type" value="<?php echo esc_attr($doc['fileType'] ?? ''); ?>" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                                </div>
                                <div style="flex:1;min-width:150px;">
                                    <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">File Size</label>
                                    <input type="text" placeholder="e.g., 2.5 MB" class="niser-doc-size" value="<?php echo esc_attr($doc['fileSize'] ?? ''); ?>" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                                </div>
                            </div>
                            <div style="margin-bottom:8px;">
                                <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">Description (Optional)</label>
                                <textarea placeholder="Brief description of this document" class="niser-doc-desc" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:3px;height:60px;box-sizing:border-box;"></textarea>
                            </div>
                            <button type="button" class="button button-secondary niser-remove-doc" style="margin-top:5px;">🗑️ Remove Document</button>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <button type="button" class="button button-primary" id="niser_add_document" style="margin-top:10px;">+ Add Document</button>
        </p>
    </div>
    
    <p>
        <label><input type="checkbox" name="niser_insight_is_breaking" value="1" <?php checked($is_breaking, 1); ?> /> Breaking</label>
    </p>
    <p>
        <label><input type="checkbox" name="niser_insight_ai_generated" value="1" <?php checked($ai_generated, 1); ?> /> AI-Assisted</label>
    </p>
    <?php
}

function niser_insight_save_fields_from_request($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['niser_insight_nonce']) && !wp_verify_nonce($_POST['niser_insight_nonce'], 'niser_insight_nonce')) {
        return;
    }

    if (isset($_POST['niser_insight_content_type'])) {
        niser_insight_update_meta($post_id, 'content_type', sanitize_key($_POST['niser_insight_content_type']));
    }

    if (isset($_POST['niser_insight_social_summary'])) {
        niser_insight_update_meta($post_id, 'social_summary', sanitize_textarea_field($_POST['niser_insight_social_summary']));
    }

    if (isset($_POST['niser_insight_featured_image'])) {
        niser_insight_update_meta($post_id, 'featured_image_url', esc_url_raw($_POST['niser_insight_featured_image']));
    }

    if (isset($_POST['niser_insight_pdf_file'])) {
        niser_insight_update_meta($post_id, 'pdf_file_url', esc_url_raw($_POST['niser_insight_pdf_file']));
    }

    if (isset($_POST['niser_documents_json'])) {
        $documents = json_decode(wp_unslash($_POST['niser_documents_json']), true);
        if (is_array($documents)) {
            niser_insight_update_meta($post_id, 'documents', wp_json_encode($documents));
        }
    } else {
        niser_insight_update_meta($post_id, 'documents', '[]');
    }

    if (isset($_POST['niser_insight_is_breaking'])) {
        niser_insight_update_meta($post_id, 'is_breaking', 1);
    } else {
        niser_insight_update_meta($post_id, 'is_breaking', 0);
    }

    if (isset($_POST['niser_insight_ai_generated'])) {
        niser_insight_update_meta($post_id, 'ai_generated', 1);
    } else {
        niser_insight_update_meta($post_id, 'ai_generated', 0);
    }
}
add_action('save_post_niser_insight', 'niser_insight_save_fields_from_request');

// JavaScript for managing documents in admin
add_action('admin_footer-post.php', function() {
    global $post_type;
    if ($post_type !== 'niser_insight') {
        return;
    }
    ?>
    <script type="text/javascript">
    console.log('NISER Documents script loaded');
    
    (function() {
        function initDocuments() {
            console.log('Initializing documents...');
            const addBtn = document.getElementById('niser_add_document');
            const container = document.getElementById('niser_documents_container');
            
            console.log('Add button found:', !!addBtn);
            console.log('Container found:', !!container);
            
            if (!addBtn || !container) {
                console.log('ERROR: Document elements not found');
                // Try again after a short delay
                setTimeout(initDocuments, 500);
                return;
            }
            
            console.log('Documents section initialized successfully');
            
            function createDocItem() {
                const item = document.createElement('div');
                item.className = 'niser-document-item';
                item.style.cssText = 'border:1px solid #ddd;padding:10px;margin-bottom:10px;border-radius:4px;background:white;';
                item.innerHTML = `
                    <div style="margin-bottom:8px;">
                        <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">Document Title</label>
                        <input type="text" placeholder="Enter document name" class="niser-doc-title" style="width:100%;max-width:400px;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                    </div>
                    <div style="margin-bottom:8px;">
                        <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">Document URL</label>
                        <input type="url" placeholder="https://example.com/document.pdf" class="niser-doc-url" style="width:100%;max-width:500px;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                    </div>
                    <div style="display:flex;gap:15px;margin-bottom:8px;">
                        <div style="flex:1;min-width:150px;">
                            <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">File Type</label>
                            <input type="text" placeholder="PDF, Word, Excel, etc." class="niser-doc-type" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                        </div>
                        <div style="flex:1;min-width:150px;">
                            <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">File Size</label>
                            <input type="text" placeholder="e.g., 2.5 MB" class="niser-doc-size" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;" />
                        </div>
                    </div>
                    <div style="margin-bottom:8px;">
                        <label style="display:block;font-weight:bold;color:#333;margin-bottom:3px;font-size:0.9em;">Description (Optional)</label>
                        <textarea placeholder="Brief description of this document" class="niser-doc-desc" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:3px;height:60px;box-sizing:border-box;"></textarea>
                    </div>
                    <button type="button" class="button button-secondary niser-remove-doc" style="margin-top:5px;">🗑️ Remove Document</button>
                `;
                const removeBtn = item.querySelector('.niser-remove-doc');
                removeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    item.remove();
                });
                return item;
            }
            
            // Add button click handler
            addBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Add button clicked');
                container.appendChild(createDocItem());
            });
            
            // Attach click handlers to existing remove buttons
            document.querySelectorAll('.niser-remove-doc').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.closest('.niser-document-item').remove();
                });
            });
            
            // Handle form submission
            const form = document.getElementById('post');
            if (form) {
                // Use a capture phase listener to catch the form submission early
                form.addEventListener('submit', function(e) {
                    console.log('Form submitted, serializing documents');
                    const documents = [];
                    document.querySelectorAll('.niser-document-item').forEach(item => {
                        const title = item.querySelector('.niser-doc-title').value.trim();
                        const url = item.querySelector('.niser-doc-url').value.trim();
                        if (title && url) {
                            documents.push({
                                id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                                title: title,
                                url: url,
                                fileType: item.querySelector('.niser-doc-type').value.trim() || '',
                                fileSize: item.querySelector('.niser-doc-size').value.trim() || '',
                                description: item.querySelector('.niser-doc-desc').value.trim() || ''
                            });
                        }
                    });
                    
                    console.log('Documents to save:', documents);
                    
                    // Remove existing hidden input if present
                    const existingInput = form.querySelector('input[name="niser_documents_json"]');
                    if (existingInput) {
                        existingInput.remove();
                    }
                    
                    // Add new hidden input with documents JSON
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'niser_documents_json';
                    input.value = JSON.stringify(documents);
                    form.appendChild(input);
                }, true);
            }
        }
        
        // Run immediately
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDocuments);
        } else {
            // Try to initialize, and if elements aren't ready, retry
            setTimeout(initDocuments, 100);
        }
    })();
    </script>
    <?php
});

function niser_insight_add_custom_columns($columns) {
    if (!is_array($columns)) {
        $columns = array();
    }

    $new_columns = array();
    $inserted = false;

    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;

        if ($key === 'title' && !$inserted) {
            $new_columns['content_type'] = 'Type';
            $new_columns['featured_image_url'] = 'Image';
            $new_columns['pdf_file_url'] = 'PDF';
            $new_columns['documents_count'] = 'Attachments';
            $inserted = true;
        }
    }

    if (!$inserted) {
        $new_columns['content_type'] = 'Type';
        $new_columns['featured_image_url'] = 'Image';
        $new_columns['pdf_file_url'] = 'PDF';
        $new_columns['documents_count'] = 'Attachments';
    }

    return $new_columns;
}
// Register admin list columns and related hooks during admin_init so they
// are applied after the post type has been registered and show in Screen Options.
add_action('admin_init', function() {
    add_filter('manage_niser_insight_posts_columns', 'niser_insight_add_custom_columns', 20);
    add_filter('manage_edit-niser_insight_columns', 'niser_insight_add_custom_columns', 20);
    add_action('manage_niser_insight_posts_custom_column', 'niser_insight_custom_column_content', 10, 2);
});

function niser_insight_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'content_type':
            $type = niser_insight_get_meta($post_id, 'content_type', 'policy_brief');
            echo esc_html(str_replace('_', ' ', $type));
            break;
        case 'featured_image_url':
            $image = niser_insight_get_meta($post_id, 'featured_image_url', '');
            echo $image ? '<span data-image-url="' . esc_attr($image) . '" style="color:green;">✓</span>' : '<span data-image-url="">—</span>';
            break;
        case 'pdf_file_url':
            $pdf = niser_insight_get_meta($post_id, 'pdf_file_url', '');
            echo $pdf ? '<span data-pdf-url="' . esc_attr($pdf) . '" style="color:green;">✓</span>' : '<span data-pdf-url="">—</span>';
            break;
        case 'documents_count':
            $documents_json = niser_insight_get_meta($post_id, 'documents', '[]');
            $documents = json_decode($documents_json, true) ?: [];
            $count = count($documents);
            echo $count > 0 
                ? '<span style="background-color:#90EE90;padding:2px 6px;border-radius:3px;font-weight:bold;">' . esc_html($count) . '</span>'
                : '<span style="color:#999;">—</span>';
            break;
    }
}
/* previously registered during admin_init above */

function niser_insight_quick_edit_fields_html() {
    return '
    <fieldset class="inline-edit-col-left niser-insight-quick-edit-fields">
        <div class="inline-edit-group wp-clearfix">
            <label class="alignleft">
                <span class="title">Content Type</span>
                <select name="quick_edit_content_type" class="quickedit-content-type">
                    <option value="policy_brief">Policy Brief</option>
                    <option value="commentary">Commentary</option>
                    <option value="analysis">Analysis</option>
                    <option value="opinion">Opinion</option>
                    <option value="rapid_response">Rapid Response</option>
                </select>
            </label>
        </div>
    </fieldset>
    <fieldset class="inline-edit-col-right niser-insight-quick-edit-fields">
        <div class="inline-edit-group wp-clearfix">
            <label class="alignleft">
                <span class="title">Featured Image URL</span>
                <span class="input-text-wrap">
                    <input type="url" name="quick_edit_featured_image" class="quickedit-featured-image" value="" />
                </span>
            </label>
        </div>
    </fieldset>
    <fieldset class="inline-edit-col-left niser-insight-quick-edit-fields">
        <div class="inline-edit-group wp-clearfix">
            <label class="alignleft">
                <span class="title">PDF Download URL</span>
                <span class="input-text-wrap">
                    <input type="url" name="quick_edit_pdf_file" class="quickedit-pdf-file" value="" />
                </span>
            </label>
        </div>
    </fieldset>
    <fieldset class="inline-edit-col-right niser-insight-quick-edit-fields">
        <div class="inline-edit-group wp-clearfix">
            <label class="alignleft">
                <span class="title">Attached Documents</span>
                <span class="quickedit-documents-count" style="display:block;padding:5px;background:#f0f0f0;border-radius:3px;font-style:italic;color:#666;">Click Edit to manage documents</span>
            </label>
        </div>
    </fieldset>';
}

function niser_insight_quick_edit_custom_box($column, $post_type) {
    if ($post_type !== 'niser_insight' || $column !== 'content_type') {
        return;
    }
    echo niser_insight_quick_edit_fields_html();
}
add_action('quick_edit_custom_box', 'niser_insight_quick_edit_custom_box', 10, 2);

function niser_insight_inline_edit_js() {
    global $pagenow;

    if ($pagenow !== 'edit.php' || !isset($_GET['post_type']) || $_GET['post_type'] !== 'niser_insight') {
        return;
    }
    ?>
    <script type="text/javascript">
    (function($) {
        function insertInsightQuickEditFields($inlineEditor) {
            if ($inlineEditor.find('.niser-insight-quick-edit-fields').length) {
                return;
            }

            const html = '
                <fieldset class="inline-edit-col-left niser-insight-quick-edit-fields">\n' +
                    '<div class="inline-edit-group wp-clearfix">\n' +
                        '<label class="alignleft">\n' +
                            '<span class="title">Content Type</span>\n' +
                            '<select name="quick_edit_content_type" class="quickedit-content-type">\n' +
                                '<option value="policy_brief">Policy Brief</option>\n' +
                                '<option value="commentary">Commentary</option>\n' +
                                '<option value="analysis">Analysis</option>\n' +
                                '<option value="opinion">Opinion</option>\n' +
                                '<option value="rapid_response">Rapid Response</option>\n' +
                            '</select>\n' +
                        '</label>\n' +
                    '</div>\n' +
                '</fieldset>\n' +
                '<fieldset class="inline-edit-col-right niser-insight-quick-edit-fields">\n' +
                    '<div class="inline-edit-group wp-clearfix">\n' +
                        '<label class="alignleft">\n' +
                            '<span class="title">Featured Image URL</span>\n' +
                            '<span class="input-text-wrap">\n' +
                                '<input type="url" name="quick_edit_featured_image" class="quickedit-featured-image" value="" />\n' +
                            '</span>\n' +
                        '</label>\n' +
                    '</div>\n' +
                '</fieldset>\n' +
                '<fieldset class="inline-edit-col-left niser-insight-quick-edit-fields">\n' +
                    '<div class="inline-edit-group wp-clearfix">\n' +
                        '<label class="alignleft">\n' +
                            '<span class="title">PDF Download URL</span>\n' +
                            '<span class="input-text-wrap">\n' +
                                '<input type="url" name="quick_edit_pdf_file" class="quickedit-pdf-file" value="" />\n' +
                            '</span>\n' +
                        '</label>\n' +
                    '</div>\n' +
                '</fieldset>\n' +
                '<fieldset class="inline-edit-col-right niser-insight-quick-edit-fields">\n' +
                    '<div class="inline-edit-group wp-clearfix">\n' +
                        '<label class="alignleft">\n' +
                            '<span class="title">Attached Documents</span>\n' +
                            '<span class="quickedit-documents-count" style="display:block;padding:5px;background:#f0f0f0;border-radius:3px;font-style:italic;color:#666;">Click Edit to manage documents</span>\n' +
                        '</label>\n' +
                    '</div>\n' +
                '</fieldset>';

            const $firstLeft = $inlineEditor.find('.inline-edit-col-left').first();
            if ($firstLeft.length) {
                $firstLeft.before(html);
            } else {
                $inlineEditor.append(html);
            }
        }

        $(document).ready(function() {
            var $inlineEditor = $('#inline-edit');

            $('#the-list').on('click', 'a.editinline', function() {
                var $link = $(this);
                setTimeout(function() {
                    $inlineEditor = $('#inline-edit');
                    if (!$inlineEditor.length) {
                        return;
                    }

                    insertInsightQuickEditFields($inlineEditor);

                    var postId = $link.closest('tr').attr('id');
                    if (!postId) {
                        return;
                    }
                    postId = postId.replace('post-', '');

                    var $row = $('#post-' + postId);
                    var typeText = $row.find('.column-content_type').text().trim().toLowerCase().replace(/\s+/g, '_');
                    var imageValue = $row.find('.column-featured_image_url [data-image-url]').data('image-url') || '';
                    var pdfValue = $row.find('.column-pdf_file_url [data-pdf-url]').data('pdf-url') || '';
                    var docCountText = $row.find('.column-documents_count').text().trim();
                    var docCountDisplay = docCountText === '—' ? 'No documents attached' : docCountText + ' document(s) attached';

                    $inlineEditor.find('select[name="quick_edit_content_type"]').val(typeText || 'policy_brief');
                    $inlineEditor.find('input[name="quick_edit_featured_image"]').val(imageValue);
                    $inlineEditor.find('input[name="quick_edit_pdf_file"]').val(pdfValue);
                    $inlineEditor.find('.quickedit-documents-count').text(docCountDisplay);
                }, 100);
            });
        });
    })(jQuery);
    </script>
    <?php
}
add_action('admin_print_footer_scripts', 'niser_insight_inline_edit_js');

function niser_insight_edit_form_advanced($post) {
    if ($post->post_type !== 'niser_insight') {
        return;
    }
    wp_nonce_field('niser_insight_quick_edit_nonce', 'niser_insight_quick_edit_nonce');
}
add_action('edit_form_advanced', 'niser_insight_edit_form_advanced');

// Diagnostic: show registered columns on the Insights list for debugging.
function niser_insight_admin_diagnostics() {
    global $pagenow;
    if ($pagenow !== 'edit.php') {
        return;
    }
    // Prefer checking the query arg since get_current_screen() can be unreliable
    // at certain hook timings. Allow editors (site admins and editors) to see this.
    if (!isset($_GET['post_type']) || $_GET['post_type'] !== 'niser_insight') {
        return;
    }
    if (!current_user_can('edit_posts')) {
        return;
    }

    $screen_id = 'edit-niser_insight';
    $cols_current = get_column_headers($screen_id);
    $cols_filtered_a = apply_filters('manage_niser_insight_posts_columns', array());
    $cols_filtered_b = apply_filters('manage_edit-niser_insight_columns', array());

    echo '<div class="notice notice-info is-dismissible">';
    echo '<p><strong>Insights columns diagnostic</strong></p>';
    echo '<p><em>get_column_headers("' . esc_html($screen_id) . '")</em>:</p><pre>' . esc_html(print_r($cols_current, true)) . '</pre>';
    echo '<p><em>apply_filters("manage_niser_insight_posts_columns") result:</em></p><pre>' . esc_html(print_r($cols_filtered_a, true)) . '</pre>';
    echo '<p><em>apply_filters("manage_edit-niser_insight_columns") result:</em></p><pre>' . esc_html(print_r($cols_filtered_b, true)) . '</pre>';
    echo '</div>';
}
add_action('admin_notices', 'niser_insight_admin_diagnostics');

function niser_insight_save_quick_edit($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['niser_insight_quick_edit_nonce']) && !wp_verify_nonce($_POST['niser_insight_quick_edit_nonce'], 'niser_insight_quick_edit_nonce')) {
        return;
    }

    if (isset($_POST['quick_edit_content_type'])) {
        niser_insight_update_meta($post_id, 'content_type', sanitize_key($_POST['quick_edit_content_type']));
    }

    if (isset($_POST['quick_edit_featured_image'])) {
        niser_insight_update_meta($post_id, 'featured_image_url', esc_url_raw($_POST['quick_edit_featured_image']));
    }

    if (isset($_POST['quick_edit_pdf_file'])) {
        niser_insight_update_meta($post_id, 'pdf_file_url', esc_url_raw($_POST['quick_edit_pdf_file']));
    }
}
add_action('save_post_niser_insight', 'niser_insight_save_quick_edit', 10, 1);

add_action('rest_api_init', function() {
    register_rest_route('niser/v1', '/insights', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $params = $request->get_query_params();
            $args = array(
                'post_type' => 'niser_insight',
                'post_status' => array('publish'),
                'posts_per_page' => isset($params['limit']) ? intval($params['limit']) : 20,
                'orderby' => 'date',
                'order' => 'DESC',
            );

            if (!empty($params['contentType'])) {
                $args['meta_query'] = array(
                    array(
                        'key' => '_niser_content_type',
                        'value' => sanitize_key($params['contentType']),
                        'compare' => '=',
                    ),
                );
            }

            $q = new WP_Query($args);
            $results = array_map(function($p) {
                return array(
                    'id' => (string) $p->ID,
                    'title' => get_the_title($p),
                    'slug' => $p->post_name,
                    'contentType' => niser_insight_get_meta($p->ID, 'content_type', 'policy_brief'),
                    'author' => array(
                        'fullName' => niser_insight_get_meta($p->ID, 'author_full_name', ''),
                        'titlePrefix' => niser_insight_get_meta($p->ID, 'author_title_prefix', ''),
                        'slug' => niser_insight_get_meta($p->ID, 'author_slug', ''),
                    ),
                    'publishedDate' => get_the_date('c', $p->ID),
                    'body' => $p->post_content,
                    'bodyPlaintext' => wp_strip_all_tags($p->post_content),
                    'excerpt' => !empty($p->post_excerpt)
                        ? wp_strip_all_tags($p->post_excerpt)
                        : wp_trim_words(wp_strip_all_tags($p->post_content), 32),
                    'socialSummary' => niser_insight_get_meta($p->ID, 'social_summary', ''),
                    'featuredImage' => niser_insight_get_meta($p->ID, 'featured_image_url', ''),
                    'pdfFile' => niser_insight_get_meta($p->ID, 'pdf_file_url', ''),
                    'documents' => json_decode(niser_insight_get_meta($p->ID, 'documents', '[]'), true) ?: [],
                    'tags' => wp_get_post_tags($p->ID, array('fields' => 'names')),
                    'isBreaking' => (bool) niser_insight_get_meta($p->ID, 'is_breaking', false),
                    'aiGenerated' => (bool) niser_insight_get_meta($p->ID, 'ai_generated', false),
                    'status' => $p->post_status,
                );
            }, $q->posts);

            return rest_ensure_response($results);
        },
        'permission_callback' => '__return_true',
    ));

    register_rest_route('niser/v1', '/insights/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $slug = $request->get_param('slug');
            $posts = get_posts(array(
                'name' => $slug,
                'post_type' => 'niser_insight',
                'post_status' => array('publish'),
                'numberposts' => 1,
            ));
            if (empty($posts)) {
                return new WP_Error('not_found', 'Insight not found', array('status' => 404));
            }
            $post = $posts[0];
            return rest_ensure_response(array(
                'id' => (string) $post->ID,
                'title' => get_the_title($post),
                'slug' => $post->post_name,
                'contentType' => niser_insight_get_meta($post->ID, 'content_type', 'policy_brief'),
                'author' => array(
                    'fullName' => niser_insight_get_meta($post->ID, 'author_full_name', ''),
                    'titlePrefix' => niser_insight_get_meta($post->ID, 'author_title_prefix', ''),
                    'slug' => niser_insight_get_meta($post->ID, 'author_slug', ''),
                ),
                'publishedDate' => get_the_date('c', $post->ID),
                'body' => $post->post_content,
                'bodyPlaintext' => wp_strip_all_tags($post->post_content),
                'excerpt' => !empty($post->post_excerpt)
                    ? wp_strip_all_tags($post->post_excerpt)
                    : wp_trim_words(wp_strip_all_tags($post->post_content), 32),
                'socialSummary' => niser_insight_get_meta($post->ID, 'social_summary', ''),
                'featuredImage' => niser_insight_get_meta($post->ID, 'featured_image_url', ''),
                'pdfFile' => niser_insight_get_meta($post->ID, 'pdf_file_url', ''),
                'documents' => json_decode(niser_insight_get_meta($post->ID, 'documents', '[]'), true) ?: [],
                'tags' => wp_get_post_tags($post->ID, array('fields' => 'names')),
                'isBreaking' => (bool) niser_insight_get_meta($post->ID, 'is_breaking', false),
                'aiGenerated' => (bool) niser_insight_get_meta($post->ID, 'ai_generated', false),
                'status' => $post->post_status,
            ));
        },
        'permission_callback' => '__return_true',
    ));
});

// ─── Gallery: CPT, meta, admin UI, REST listing ────────────────────────────────

function niser_gallery_get_meta($post_id, $key, $default = '') {
    $value = get_post_meta($post_id, '_niser_' . $key, true);
    return $value !== '' && $value !== null ? $value : $default;
}

function niser_gallery_update_meta($post_id, $key, $value) {
    update_post_meta($post_id, '_niser_' . $key, $value);
    return $value;
}

function niser_register_gallery_cpt() {
    $labels = array(
        'name' => 'Gallery',
        'singular_name' => 'Gallery Item',
        'add_new_item' => 'Add New Gallery Item',
        'edit_item' => 'Edit Gallery Item',
        'new_item' => 'New Gallery Item',
    );
    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'rewrite' => array('slug' => 'gallery'),
        'has_archive' => true,
        'show_admin_column' => true,
    );
    register_post_type('niser_gallery', $args);
}
add_action('init', 'niser_register_gallery_cpt');

function niser_register_gallery_meta() {
    $fields = array(
        'description' => 'string',
        'details' => 'string',
        'image_url' => 'string',
        'video_url' => 'string',
        'gallery_type' => 'string',
    );

    foreach ($fields as $field => $type) {
        register_post_meta('niser_gallery', $field, array(
            'show_in_rest' => true,
            'single' => true,
            'type' => $type,
            'default' => '',
        ));
    }
}
add_action('init', 'niser_register_gallery_meta');

add_action('add_meta_boxes', function() {
    if (!post_type_exists('niser_gallery')) {
        return;
    }

    add_meta_box(
        'niser_gallery_details',
        'Gallery Item Details',
        'niser_gallery_meta_box_callback',
        'niser_gallery',
        'normal',
        'high'
    );
});

function niser_gallery_meta_box_callback($post) {
    $description = niser_gallery_get_meta($post->ID, 'description', '');
    $details = niser_gallery_get_meta($post->ID, 'details', '');
    $image_url = niser_gallery_get_meta($post->ID, 'image_url', '');
    $video_url = niser_gallery_get_meta($post->ID, 'video_url', '');
    $gallery_type = niser_gallery_get_meta($post->ID, 'gallery_type', 'image');

    wp_nonce_field('niser_gallery_nonce', 'niser_gallery_nonce');
    ?>
    <div style="padding: 10px 0;">
        <p>
            <label for="gallery_type"><strong>Type:</strong></label><br>
            <select id="gallery_type" name="gallery_type" style="width: 100%; padding: 8px;">
                <option value="image" <?php selected($gallery_type, 'image'); ?>>Image</option>
                <option value="video" <?php selected($gallery_type, 'video'); ?>>Video</option>
            </select>
        </p>
        <p>
            <label for="gallery_description"><strong>Description:</strong></label><br>
            <input type="text" id="gallery_description" name="gallery_description" value="<?php echo esc_attr($description); ?>" style="width: 100%; padding: 8px;" placeholder="Brief description">
        </p>
        <p>
            <label for="gallery_details"><strong>Details:</strong></label><br>
            <textarea id="gallery_details" name="gallery_details" style="width: 100%; padding: 8px; min-height: 100px;" placeholder="Detailed information about this gallery item"><?php echo esc_textarea($details); ?></textarea>
        </p>
        <p>
            <label for="gallery_image_url"><strong>Image URL:</strong></label><br>
            <input type="url" id="gallery_image_url" name="gallery_image_url" value="<?php echo esc_attr($image_url); ?>" style="width: 100%; padding: 8px;" placeholder="https://example.com/image.jpg">
        </p>
        <p>
            <label for="gallery_video_url"><strong>Video URL (for video items):</strong></label><br>
            <input type="url" id="gallery_video_url" name="gallery_video_url" value="<?php echo esc_attr($video_url); ?>" style="width: 100%; padding: 8px;" placeholder="https://example.com/video.mp4">
        </p>
    </div>
    <?php
}

add_action('save_post_niser_gallery', function($post_id) {
    if (!isset($_POST['niser_gallery_nonce']) || !wp_verify_nonce($_POST['niser_gallery_nonce'], 'niser_gallery_nonce')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    niser_gallery_update_meta($post_id, 'description', sanitize_text_field($_POST['gallery_description'] ?? ''));
    niser_gallery_update_meta($post_id, 'details', sanitize_textarea_field($_POST['gallery_details'] ?? ''));
    niser_gallery_update_meta($post_id, 'image_url', esc_url_raw($_POST['gallery_image_url'] ?? ''));
    niser_gallery_update_meta($post_id, 'video_url', esc_url_raw($_POST['gallery_video_url'] ?? ''));
    niser_gallery_update_meta($post_id, 'gallery_type', sanitize_text_field($_POST['gallery_type'] ?? 'image'));
});

add_action('rest_api_init', function() {
    register_rest_route('niser/v1', '/gallery', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $gallery_type = $request->get_param('type') ?? 'all';
            $args = array(
                'post_type' => 'niser_gallery',
                'posts_per_page' => -1,
                'post_status' => 'publish',
                'orderby' => 'date',
                'order' => 'DESC',
            );

            if ($gallery_type !== 'all') {
                $args['meta_query'] = array(
                    array(
                        'key' => '_niser_gallery_type',
                        'value' => $gallery_type,
                    ),
                );
            }

            $posts = get_posts($args);
            $results = array_map(function($post) {
                return array(
                    'id' => $post->ID,
                    'slug' => $post->post_name,
                    'title' => $post->post_title,
                    'description' => niser_gallery_get_meta($post->ID, 'description', ''),
                    'details' => niser_gallery_get_meta($post->ID, 'details', ''),
                    'imageUrl' => niser_gallery_get_meta($post->ID, 'image_url', ''),
                    'videoUrl' => niser_gallery_get_meta($post->ID, 'video_url', ''),
                    'type' => niser_gallery_get_meta($post->ID, 'gallery_type', 'image'),
                );
            }, $posts);

            return rest_ensure_response($results);
        },
        'permission_callback' => '__return_true',
    ));

    register_rest_route('niser/v1', '/gallery/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $slug = $request->get_param('slug');
            $posts = get_posts(array(
                'name' => $slug,
                'post_type' => 'niser_gallery',
                'post_status' => 'publish',
            ));

            if (empty($posts)) {
                return new WP_Error('not_found', 'Gallery item not found', array('status' => 404));
            }

            $post = $posts[0];
            return rest_ensure_response(array(
                'id' => $post->ID,
                'slug' => $post->post_name,
                'title' => $post->post_title,
                'description' => niser_gallery_get_meta($post->ID, 'description', ''),
                'details' => niser_gallery_get_meta($post->ID, 'details', ''),
                'imageUrl' => niser_gallery_get_meta($post->ID, 'image_url', ''),
                'videoUrl' => niser_gallery_get_meta($post->ID, 'video_url', ''),
                'type' => niser_gallery_get_meta($post->ID, 'gallery_type', 'image'),
            ));
        },
        'permission_callback' => '__return_true',
    ));
});

// ─── Events: CPT, meta, admin UI, REST listing ──────────────────────────────

function niser_register_event_cpt() {
    $labels = array(
        'name' => 'Events',
        'singular_name' => 'Event',
    );
    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title','editor','thumbnail'),
        'rewrite' => array('slug' => 'events'),
        'has_archive' => true,
    );
    register_post_type('niser_event', $args);
}
add_action('init', 'niser_register_event_cpt');

function niser_register_event_meta() {
    register_post_meta('niser_event', 'start_datetime', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));
    register_post_meta('niser_event', 'end_datetime', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));
    register_post_meta('niser_event', 'all_day', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
        'default' => false,
    ));
    register_post_meta('niser_event', 'location', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));
    register_post_meta('niser_event', 'external_url', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));
    register_post_meta('niser_event', 'image_id', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'integer',
    ));
}
add_action('init', 'niser_register_event_meta');

add_action('add_meta_boxes', function() {
    if (!post_type_exists('niser_event')) {
        return;
    }

    add_meta_box(
        'niser_event_details',
        'Event Details',
        'niser_event_meta_box_callback',
        'niser_event',
        'normal',
        'high'
    );
});

function niser_event_meta_box_callback($post) {
    $start = get_post_meta($post->ID, 'start_datetime', true);
    $end = get_post_meta($post->ID, 'end_datetime', true);
    $all_day = get_post_meta($post->ID, 'all_day', true);
    $location = get_post_meta($post->ID, 'location', true);
    $external_url = get_post_meta($post->ID, 'external_url', true);
    $image_id = get_post_meta($post->ID, 'image_id', true);

    wp_nonce_field('niser_event_nonce', 'niser_event_nonce');
    ?>
    <p>
        <label for="niser_event_start"><strong>Start</strong></label><br />
        <input type="datetime-local" id="niser_event_start" name="niser_event_start" value="<?php echo esc_attr($start); ?>" />
    </p>
    <p>
        <label for="niser_event_end"><strong>End</strong></label><br />
        <input type="datetime-local" id="niser_event_end" name="niser_event_end" value="<?php echo esc_attr($end); ?>" />
    </p>
    <p>
        <label><input type="checkbox" name="niser_event_all_day" value="1" <?php checked($all_day, 1); ?> /> All-day event</label>
    </p>
    <p>
        <label for="niser_event_location"><strong>Location</strong></label><br />
        <input type="text" id="niser_event_location" name="niser_event_location" value="<?php echo esc_attr($location); ?>" style="width:100%; max-width:400px;" />
    </p>
    <p>
        <label for="niser_event_url"><strong>URL</strong></label><br />
        <input type="url" id="niser_event_url" name="niser_event_url" value="<?php echo esc_attr($external_url); ?>" style="width:100%; max-width:400px;" />
    </p>
    <?php
}

function niser_event_save_fields_from_request($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['niser_event_nonce'])) {
        if (!wp_verify_nonce($_POST['niser_event_nonce'], 'niser_event_nonce')) {
            return;
        }
    }

    if (isset($_POST['niser_event_start'])) {
        $start = sanitize_text_field($_POST['niser_event_start']);
        update_post_meta($post_id, 'start_datetime', $start);
    }

    if (isset($_POST['niser_event_end'])) {
        $end = sanitize_text_field($_POST['niser_event_end']);
        update_post_meta($post_id, 'end_datetime', $end);
    }

    if (isset($_POST['niser_event_all_day'])) {
        update_post_meta($post_id, 'all_day', 1);
    } else {
        update_post_meta($post_id, 'all_day', 0);
    }

    if (isset($_POST['niser_event_location'])) {
        update_post_meta($post_id, 'location', sanitize_text_field($_POST['niser_event_location']));
    }

    if (isset($_POST['niser_event_url'])) {
        update_post_meta($post_id, 'external_url', esc_url_raw($_POST['niser_event_url']));
    }
}
add_action('save_post_niser_event', 'niser_event_save_fields_from_request');

// ─── Events: Quick Edit Columns & Inline Fields ─────────────────────────────

function niser_event_add_custom_columns($columns) {
    $new_columns = array();
    foreach ($columns as $key => $value) {
        if ($key === 'date') {
            $new_columns['start_datetime'] = 'Start Date';
            $new_columns['location'] = 'Location';
            $new_columns['all_day'] = 'All Day';
            $new_columns[$key] = $value;
        } else {
            $new_columns[$key] = $value;
        }
    }
    return $new_columns;
}
add_filter('manage_niser_event_posts_columns', 'niser_event_add_custom_columns');

function niser_event_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'start_datetime':
            $start = get_post_meta($post_id, 'start_datetime', true);
            $formatted = $start ? date('M d, Y @ H:i', strtotime($start)) : '—';
            // Add raw value in data attribute for quick edit
            echo sprintf(
                '<span data-start-datetime="%s">%s</span>',
                esc_attr($start),
                esc_html($formatted)
            );
            break;
        case 'location':
            $location = get_post_meta($post_id, 'location', true);
            echo esc_html($location ?: '—');
            break;
        case 'all_day':
            $all_day = get_post_meta($post_id, 'all_day', true);
            echo $all_day ? '<span style="color:green;">✓ Yes</span>' : '<span style="color:#999;">No</span>';
            break;
    }
}
add_action('manage_niser_event_posts_custom_column', 'niser_event_custom_column_content', 10, 2);

function niser_event_make_columns_sortable($columns) {
    $columns['start_datetime'] = 'start_datetime';
    $columns['location'] = 'location';
    return $columns;
}
add_filter('manage_edit-niser_event_sortable_columns', 'niser_event_make_columns_sortable');

function niser_event_quick_edit_custom_box($column, $post_type) {
    if ($post_type !== 'niser_event') {
        return;
    }

    // Only output on the first relevant column to avoid duplicates
    if ($column !== 'start_datetime') {
        return;
    }
    ?>
    <fieldset class="inline-edit-col-left">
        <div class="inline-edit-group wp-clearfix">
            <label class="alignleft">
                <span class="title">Start Date</span>
                <span class="input-text-wrap">
                    <input type="datetime-local" name="quick_edit_start_datetime" class="quickedit-start-datetime" />
                </span>
            </label>
        </div>
    </fieldset>
    <fieldset class="inline-edit-col-right">
        <div class="inline-edit-group wp-clearfix">
            <label class="alignleft">
                <span class="title">Location</span>
                <span class="input-text-wrap">
                    <input type="text" name="quick_edit_location" class="quickedit-location" value="" />
                </span>
            </label>
        </div>
    </fieldset>
    <fieldset class="inline-edit-col-left">
        <div class="inline-edit-group wp-clearfix">
            <label class="alignleft">
                <input type="checkbox" name="quick_edit_all_day" class="quickedit-all-day" value="1" />
                <span class="checkbox-title">All-day Event</span>
            </label>
        </div>
    </fieldset>
    <?php
}
add_action('quick_edit_custom_box', 'niser_event_quick_edit_custom_box', 10, 2);

function niser_event_edit_form_advanced($post) {
    if ($post->post_type !== 'niser_event') {
        return;
    }
    wp_nonce_field('niser_event_quick_edit_nonce', 'niser_event_quick_edit_nonce');
}
add_action('edit_form_advanced', 'niser_event_edit_form_advanced');

function niser_event_save_quick_edit($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['niser_event_quick_edit_nonce'])) {
        if (!wp_verify_nonce($_POST['niser_event_quick_edit_nonce'], 'niser_event_quick_edit_nonce')) {
            return;
        }
    }

    if (isset($_POST['quick_edit_start_datetime']) && !empty($_POST['quick_edit_start_datetime'])) {
        update_post_meta($post_id, 'start_datetime', sanitize_text_field($_POST['quick_edit_start_datetime']));
    }

    if (isset($_POST['quick_edit_location']) && !empty($_POST['quick_edit_location'])) {
        update_post_meta($post_id, 'location', sanitize_text_field($_POST['quick_edit_location']));
    }

    if (isset($_POST['quick_edit_all_day'])) {
        update_post_meta($post_id, 'all_day', 1);
    } else {
        if (isset($_POST['action']) && $_POST['action'] === 'inline-save') {
            update_post_meta($post_id, 'all_day', 0);
        }
    }
}
add_action('save_post_niser_event', 'niser_event_save_quick_edit', 10, 1);

// Inline edit JavaScript to populate Quick Edit fields
function niser_event_inline_edit_js() {
    global $pagenow, $current_screen;
    
    if (!isset($current_screen)) {
        return;
    }
    
    if ($current_screen->post_type !== 'niser_event' || $pagenow !== 'edit.php') {
        return;
    }
    ?>
    <script type="text/javascript">
    (function($) {
        $(document).ready(function() {
            // WP inline editor
            const $inline_editor = $('#inline-edit');
            const wp_inline = inlineEditPost;
            
            // Store original edit function
            const original_edit = wp_inline.edit;
            
            // Override edit function
            wp_inline.edit = function(id) {
                original_edit.apply(this, arguments);
                
                const post_id = id;
                if (!post_id) return;
                
                const $post_row = $('#post-' + post_id);
                if (!$post_row.length) return;
                
                // Extract data from table cells
                const $start_cell = $post_row.find('.column-start_datetime');
                const start_datetime = $start_cell.find('[data-start-datetime]').data('start-datetime') || '';
                const location_text = $post_row.find('.column-location').text().trim();
                const all_day_text = $post_row.find('.column-all_day').text().trim();
                
                // Convert datetime to datetime-local format (YYYY-MM-DDTHH:mm)
                let start_value = '';
                if (start_datetime) {
                    try {
                        const dateObj = new Date(start_datetime);
                        if (!isNaN(dateObj.getTime())) {
                            start_value = dateObj.toISOString().slice(0, 16);
                        }
                    } catch (e) {
                        console.error('Date parse error:', e);
                    }
                }
                
                // Populate fields
                $inline_editor.find('input[name="quick_edit_start_datetime"]').val(start_value);
                $inline_editor.find('input[name="quick_edit_location"]').val(location_text === '—' ? '' : location_text);
                $inline_editor.find('input[name="quick_edit_all_day"]').prop('checked', all_day_text.includes('Yes'));
            };
        });
    })(jQuery);
    </script>
    <?php
}
add_action('admin_print_footer_scripts', 'niser_event_inline_edit_js');

add_action('rest_api_init', function() {
    register_rest_route('niser/v1', '/events', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $params = $request->get_query_params();
            $now = isset($params['now']) ? $params['now'] : gmdate('Y-m-d\\TH:i:s\\Z');

            $args = array(
                'post_type' => 'niser_event',
                'posts_per_page' => -1,
                'post_status' => array('publish','future'),
                'orderby' => 'meta_value',
                'meta_key' => 'start_datetime',
                'order' => 'ASC',
            );

            if (!empty($params['upcoming']) && $params['upcoming']) {
                $args['meta_query'] = array(
                    array(
                        'key' => 'start_datetime',
                        'value' => $now,
                        'compare' => '>=',
                        'type' => 'CHAR'
                    )
                );
            }

            $q = new WP_Query($args);
            $results = array_map(function($p) {
                return array(
                    'id' => $p->ID,
                    'title' => get_the_title($p),
                    'start' => get_post_meta($p->ID, 'start_datetime', true),
                    'end' => get_post_meta($p->ID, 'end_datetime', true),
                    'allDay' => (bool) get_post_meta($p->ID, 'all_day', true),
                    'location' => get_post_meta($p->ID, 'location', true),
                    'url' => get_post_meta($p->ID, 'external_url', true),
                );
            }, $q->posts);

            return rest_ensure_response($results);
        },
        'permission_callback' => '__return_true',
    ));
});
