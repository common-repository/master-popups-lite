<?php

$xbox->add_field(array(
    'type' => 'title',
    'name' => 'Rate our Plugin',
    'desc' => '5 Stars',
));
$xbox->add_field(array(
    'id' => 'rate-plugin-message',
    'type' => 'html',
    'content' => '<p>Hello dear friend.<br>
<strong>Would you like to rate our plugin?</strong><br>
Your rating is very important to us, because it helps us stay motivated and keep improving the plugin with <strong>new features.</strong>
<br><br><a href="https://codecanyon.net/downloads" target="_blank"><strong>Yes, to rate click here</strong></a>
<br><br>Thanks, I appreciate it a lot! :)
</p>',
    'options' => array(
        'show_name' => false,
    )
));
$xbox->add_field(array(
    'id' => 'rate-plugin-image',
    'type' => 'html',
    'content' => '<img src="'.MPP_URL.'assets/admin/images/rate.jpg" >',
    'options' => array(
        'show_name' => false,
    )
));