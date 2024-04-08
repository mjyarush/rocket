<?php
//const TO  = 'rbru-metrika@yandex.ru';
const TO  = 'maksim222@list.ru';// note the comma
$subject = 'Форма записи';
//Get field vars
$formData= [
    'user_name' => $_POST['user_name'],
    'user_mail' => $_POST['user_mail'],
    'user_phone' => $_POST['user_phone'],
    ];

// message
$message = <<<HTML
    <html>
    <head>
      <title>$subject от $formData[user_name]</title>
    </head>
    <body>
      <p>Here are the birthdays upcoming in August!</p>
      <table>
        <tr>
          <th>Name</th><th>Phone</th><th>Email</th>
        </tr>
        <tr>
          <td>$formData[user_name]</td><td>$formData[user_phone]</td><td>$formData[user_mail]</td>
        </tr>
      </table>
    </body>
    </html>
HTML;

$headers = 'From: mjyarush@yandex.ru' . "\r\n" .
    'Reply-To: mjyarush@yandex.ru' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();


// Mail it
$status = mail(TO, $subject, $message, $headers);

$response_msg['status'] = $status ? 'send' : 'none';

$response_msg['error'] = false;


echo json_encode($response_msg);
