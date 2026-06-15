{{--
  Contact Email Template

  Renders a contact form submission email sent to the admin.
  Displays the sender's name, email, and message in a styled card layout.
  Used by ContactMessageMail Mailable class.
--}}
<!DOCTYPE html>
<html>
<head>
  <title>New Contact Message</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 30px; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #1e293b; margin-bottom: 20px;">New Contact Message</h2>
    <p><strong>Name:</strong> {{ $data['name'] }}</p>
    <p><strong>Email:</strong> {{ $data['email'] }}</p>
    <p><strong>Message:</strong></p>
    <p style="background: #f8fafc; padding: 15px; border-radius: 8px; color: #475569;">{{ $data['message'] }}</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
    <p style="color: #94a3b8; font-size: 12px;">Sent via MediBook contact form</p>
  </div>
</body>
</html>
