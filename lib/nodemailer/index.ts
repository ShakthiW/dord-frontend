import nodemailer from "nodemailer";
import { MERCHANT_REQUEST_TEMPLATE } from "@/lib/nodemailer/templates";
import { MerchantSignupPayload } from "@/global-types";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendMerchantRequestEmail = async (
  data: MerchantSignupPayload
): Promise<void> => {
  const htmlTemplate = MERCHANT_REQUEST_TEMPLATE.replace(
    "{{businessName}}",
    data.name
  )
    .replace("{{businessEmail}}", data.businessEmail)
    .replace("{{businessPhone}}", data.businessPhone)
    .replace("{{description}}", data.description)
    .replace("{{ownerId}}", data.ownerId)
    .replace("{{slug}}", data.slug)
    .replace("{{contactName}}", data.contactName)
    .replace("{{contactEmail}}", data.contactEmail)
    .replace("{{contactPhone}}", data.contactPhone);

  const mailOptions = {
    from: `"Dord Platform" <${process.env.NODEMAILER_EMAIL}>`,
    to: process.env.DORD_SUPPORT_EMAIL,
    subject: `New Merchant Request: ${data.name}`,
    text: `New merchant request from ${data.name}. Email: ${data.businessEmail}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendCategoryRequestEmail = async (data: {
  categoryName: string;
  categoryDescription: string;
  note: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  tenantId: string;
}): Promise<void> => {
  // Import template dynamically or ensure it's imported at top
  const { CATEGORY_REQUEST_TEMPLATE } = await import(
    "@/lib/nodemailer/templates"
  );

  const htmlTemplate = CATEGORY_REQUEST_TEMPLATE.replace(
    "{{categoryName}}",
    data.categoryName
  )
    .replace("{{categoryDescription}}", data.categoryDescription)
    .replace("{{note}}", data.note)
    .replace("{{requesterName}}", data.requesterName)
    .replace("{{requesterEmail}}", data.requesterEmail)
    .replace("{{requesterPhone}}", data.requesterPhone)
    .replace("{{tenantId}}", data.tenantId);

  const mailOptions = {
    from: `"Dord Platform" <${process.env.NODEMAILER_EMAIL}>`,
    to: process.env.DORD_SUPPORT_EMAIL,
    subject: `New Category Request: ${data.categoryName}`,
    text: `New category request: ${data.categoryName} by ${data.requesterName}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
