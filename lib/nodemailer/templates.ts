export const MERCHANT_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Merchant Account Request</h1>
    </div>
    <div class="content">
      <p>A new merchant account request has been received.</p>
      <div class="details">
        <h3>Business Details</h3>
        <p><strong>Business Name:</strong> {{businessName}}</p>
        <p><strong>Business Email:</strong> {{businessEmail}}</p>
        <p><strong>Business Phone:</strong> {{businessPhone}}</p>
        <p><strong>Description:</strong> {{description}}</p>
        <p><strong>Requested Slug:</strong> {{slug}}</p>
        
        <h3>Contact Person Details</h3>
        <p><strong>Name:</strong> {{contactName}}</p>
        <p><strong>Email:</strong> {{contactEmail}}</p>
        <p><strong>Phone:</strong> {{contactPhone}}</p>
        <p><strong>Owner ID:</strong> {{ownerId}}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

export const CATEGORY_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Category Request</h1>
    </div>
    <div class="content">
      <p>A new category request has been received.</p>
      <div class="details">
        <h3>Category Details</h3>
        <p><strong>Name:</strong> {{categoryName}}</p>
        <p><strong>Description:</strong> {{categoryDescription}}</p>
        <p><strong>Note:</strong> {{note}}</p>
        
        <h3>Requester Details</h3>
        <p><strong>Name:</strong> {{requesterName}}</p>
        <p><strong>Email:</strong> {{requesterEmail}}</p>
        <p><strong>Phone:</strong> {{requesterPhone}}</p>
        <p><strong>Tenant ID:</strong> {{tenantId}}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
